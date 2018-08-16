import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Dropdown } from 'semantic-ui-react';
import UpdateAgreementZoneModal from './UpdateAgreementZoneModal';
import {
  COMPLETED_CONFIRMATION_CONTENT, COMPLETED_CONFIRMATION_HEADER,
  DETAIL_RUP_BANNER_CONTENT, PREVIEW_PDF, UPDATE_STATUS, CHANGE_REQUEST_CONFIRMATION_HEADER, CHANGE_REQUEST_CONFIRMATION_CONTENT,
} from '../../constants/strings';
import { ELEMENT_ID, PLAN_STATUS, REFERENCE_KEY } from '../../constants/variables';
import { Status, ConfirmationModal, Banner } from '../common';
import { getAgreementHolders, isStatusCreated, isStatusPending, isStatusDraft, isStatusStands, isPlanAmendment } from '../../utils';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import { EXPORT_PDF } from '../../constants/routes';

const propTypes = {
  agreement: PropTypes.shape({ zone: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
  updatePlan: PropTypes.func.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
};
const defaultProps = {
  agreement: {
    zone: {},
    usage: [],
  },
  plan: {
    agreementId: '',
    pastures: [],
    grazingSchedules: [],
    ministerIssues: [],
  },
};

class RupStaff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCompletedModalOpen: false,
      isChangeRequestModalOpen: false,
      isUpdateZoneModalOpen: false,
    };
  }

  componentDidMount() {
    this.stickyHeader = document.getElementById(ELEMENT_ID.RUP_STICKY_HEADER);
    if (this.stickyHeader) {
      // requires the absolute offsetTop value
      this.stickyHeaderOffsetTop = this.stickyHeader.offsetTop;
      this.scrollListner = window.addEventListener('scroll', this.handleScroll);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListner);
  }

  handleScroll = () => {
    if (this.stickyHeader) {
      if (window.pageYOffset >= this.stickyHeaderOffsetTop) {
        this.stickyHeader.classList.add('rup__sticky--fixed');
      } else {
        this.stickyHeader.classList.remove('rup__sticky--fixed');
      }
    }
  }

  onViewPDFClicked = () => {
    const { id: planId, agreementId } = this.props.plan || {};
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank');
  }

  openModal = property => this.setState({ [property]: true })
  closeModal = property => this.setState({ [property]: false })
  openCompletedConfirmModal = () => this.openModal('isCompletedModalOpen')
  closeCompletedConfirmModal = () => this.closeModal('isCompletedModalOpen')
  openChangeRequestConfirmModal = () => this.openModal('isChangeRequestModalOpen')
  closeChangeRequestConfirmModal = () => this.closeModal('isChangeRequestModalOpen')
  openUpdateZoneModal = () => this.openModal('isUpdateZoneModalOpen')
  closeUpdateZoneModal = () => this.closeModal('isUpdateZoneModalOpen')

  handleCompletedClicked = () => {
    this.updateStatus(PLAN_STATUS.COMPLETED, this.closeCompletedConfirmModal);
  }
  handleChangeRequestClicked = () => {
    this.updateStatus(PLAN_STATUS.CHANGE_REQUESTED, this.closeChangeRequestConfirmModal);
  }

  updateStatus = (statusCode, closeConfirmModal) => {
    const {
      references,
      updateRUPStatus,
      plan,
      updatePlan,
    } = this.props;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS] || [];
    const status = planStatuses.find(s => s.code === statusCode);
    if (status && plan) {
      const statusUpdated = (newStatus) => {
        closeConfirmModal();
        const newPlan = {
          ...plan,
          status: newStatus,
        };
        updatePlan({ plan: newPlan });
      };
      updateRUPStatus(plan.id, status.id).then(statusUpdated);
    }
  }

  renderConfirmationModal = (isUpdatingStatus) => {
    const {
      isCompletedModalOpen,
      isChangeRequestModalOpen,
    } = this.state;

    let open = false; let header = ''; let content = ''; let onNoClicked, onYesClicked;
    if (isCompletedModalOpen) {
      open = true;
      header = COMPLETED_CONFIRMATION_HEADER;
      content = COMPLETED_CONFIRMATION_CONTENT;
      onNoClicked = this.closeCompletedConfirmModal;
      onYesClicked = this.handleCompletedClicked;
    } else if (isChangeRequestModalOpen) {
      open = true;
      header = CHANGE_REQUEST_CONFIRMATION_HEADER;
      content = CHANGE_REQUEST_CONFIRMATION_CONTENT;
      onNoClicked = this.closeChangeRequestConfirmModal;
      onYesClicked = this.handleChangeRequestClicked;
    }

    return (
      <ConfirmationModal
        open={open}
        header={header}
        content={content}
        onNoClicked={onNoClicked}
        onYesClicked={onYesClicked}
        loading={isUpdatingStatus}
      />
    );
  }

  renderUpdateStatusOptions = (plan, status) => {
    let statusDropdownOptions = [];
    if (isPlanAmendment(plan)) {
      if (isStatusStands(status)) {
        statusDropdownOptions = [
          {
            key: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
            text: 'Wrongly Made - Without Effect',
          },
          {
            key: PLAN_STATUS.STANDS_WRONGLY_MADE,
            text: 'Stands - Wrongly Made',
          },
        ];
      }
    } else { // for initial plan
      if (isStatusPending(status) || isStatusCreated(status)) {
        statusDropdownOptions = [
          {
            key: PLAN_STATUS.COMPLETED,
            text: 'Completed',
            onClick: this.openCompletedConfirmModal,
          },
          {
            key: PLAN_STATUS.CHANGE_REQUESTED,
            text: 'Change Request',
            onClick: this.openChangeRequestConfirmModal,
          },
        ];
      }
    }

    return (
      <Dropdown
        text={UPDATE_STATUS}
        options={statusDropdownOptions}
        disabled={statusDropdownOptions.length === 0}
        style={{ marginLeft: '10px' }}
        button
        item
      />
    );
  }

  render() {
    const {
      agreement,
      user,
      references,
      plan,
      pasturesMap,
      grazingSchedulesMap,
      ministerIssuesMap,
      isUpdatingStatus,
    } = this.props;
    const {
      isUpdateZoneModalOpen,
    } = this.state;

    const { agreementId, status, amendmentTypeId } = plan;
    const { clients, usage: usages } = agreement;
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    let header = `${agreementId} - Range Use Plan`;
    if (amendmentTypeId && amendmentTypes) {
      const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId);
      header = `${agreementId} - ${amendmentType.description}`;
    }

    return (
      <section className="rup">
        {this.renderConfirmationModal(isUpdatingStatus)}

        <UpdateAgreementZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          plan={plan}
          agreement={agreement}
        />

        <Banner
          noDefaultHeight
          header={header}
          content={DETAIL_RUP_BANNER_CONTENT}
        />

        <div id={ELEMENT_ID.RUP_STICKY_HEADER} className="rup__sticky">
          <div className="rup__sticky__container">
            <div className="rup__sticky__left">
              <div className="rup__sticky__title">{agreementId}</div>
              <div className="rup__sticky__primary-agreement-holder">{primaryAgreementHolderName}</div>
              <Status
                className="rup__status"
                status={status}
                user={user}
              />
            </div>
            <div className="rup__sticky__btns">
              {!isStatusDraft(status) &&
                <Button
                  onClick={this.onViewPDFClicked}
                >
                  {PREVIEW_PDF}
                </Button>
              }
              {this.renderUpdateStatusOptions(plan, status)}
            </div>
          </div>
        </div>

        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            user={user}
            onZoneClicked={this.openUpdateZoneModal}
          />

          <RupPastures
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          <RupGrazingSchedules
            className="rup__schedules__container"
            references={references}
            usages={usages}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
          />

          <RupMinisterIssues
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </div>
      </section>
    );
  }
}

RupStaff.propTypes = propTypes;
RupStaff.defaultProps = defaultProps;
export default RupStaff;
