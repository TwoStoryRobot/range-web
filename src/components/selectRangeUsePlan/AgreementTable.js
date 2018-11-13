import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Pagination, Icon, Segment, Button } from 'semantic-ui-react';
import AgreementTableRow from './AgreementTableRow';
import * as strings from '../../constants/strings';
import * as selectors from '../../reducers/rootReducer';
import { Loading } from '../common';

export class AgreementTable extends Component {
  static propTypes = {
    agreements: PropTypes.arrayOf(PropTypes.object).isRequired,
    isFetchingAgreements: PropTypes.bool.isRequired,
    agreementPagination: PropTypes.shape({
      currentPage: PropTypes.number,
      totalPages: PropTypes.number,
    }).isRequired,
    errorGettingAgreements: PropTypes.shape({}),
    user: PropTypes.shape({}).isRequired,
    handlePaginationChange: PropTypes.func.isRequired,
    activeIndex: PropTypes.number.isRequired,
    handleActiveIndexChange: PropTypes.func.isRequired,
    references: PropTypes.shape({}).isRequired,
    agreementsMapWithAllPlan: PropTypes.shape({}).isRequired,
    isFetchingAgreementWithAllPlan: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    errorGettingAgreements: null,
  }

  handlePaginationChange = (e, { activePage: currentPage }) => {
    this.props.handlePaginationChange(currentPage);
  }
  renderAgreements = (agreements, errorGettingAgreements, isFetchingAgreements) => {
    if (errorGettingAgreements) {
      return (
        <div className="agrm__table__row">
          <div className="agrm__message agrm__message--error">
            {strings.ERROR_OCCUR}
            <Button
              onClick={() => window.location.reload(true)}
              style={{ marginLeft: '10px' }}
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    if (!isFetchingAgreements && agreements.length === 0) {
      return (
        <div className="agrm__table__row">
          <div className="agrm__message">
            {strings.NO_RESULTS_FOUND}
          </div>
        </div>
      );
    }

    return agreements.map(this.renderAgreementTableRow);
  }

  renderAgreementTableRow = (agreement, index) => {
    const {
      user,
      activeIndex,
      references,
      agreementsMapWithAllPlan,
      isFetchingAgreementWithAllPlan,
      handleActiveIndexChange,
    } = this.props;

    return (
      <AgreementTableRow
        user={user}
        key={index}
        index={index}
        activeIndex={activeIndex}
        agreement={agreement}
        references={references}
        agreementsMapWithAllPlan={agreementsMapWithAllPlan}
        isFetchingAgreementWithAllPlan={isFetchingAgreementWithAllPlan}
        handleActiveIndexChange={handleActiveIndexChange}
      />
    );
  }

  render() {
    const {
      agreements,
      isFetchingAgreements,
      agreementPagination,
      errorGettingAgreements,
    } = this.props;
    const { currentPage, totalPages } = agreementPagination || {};

    return (
      <Segment basic>
        <Loading active={isFetchingAgreements} />

        <div className="agrm__table">
          <div className="agrm__table__header-row">
            <div className="agrm__table__header-row__cell">{strings.RANGE_NUMBER}</div>
            <div className="agrm__table__header-row__cell">{strings.RANGE_NAME}</div>
            <div className="agrm__table__header-row__cell">{strings.AGREEMENT_HOLDER}</div>
            <div className="agrm__table__header-row__cell">{strings.STAFF_CONTACT}</div>
            <div className="agrm__table__header-row__cell">{strings.STATUS}</div>
            <div className="agrm__table__header-row__cell">
              <Icon name="plus circle" />
            </div>
          </div>

          {this.renderAgreements(agreements, errorGettingAgreements, isFetchingAgreements)}
        </div>

        <div className="agrm__pagination">
          <Pagination
            size="mini"
            siblingRange="2"
            activePage={currentPage}
            onPageChange={this.handlePaginationChange}
            totalPages={totalPages}
            ellipsisItem={{ content: <Icon name="ellipsis horizontal" />, icon: true }}
            firstItem={{ content: <Icon name="angle double left" />, icon: true }}
            lastItem={{ content: <Icon name="angle double right" />, icon: true }}
            prevItem={{ content: <Icon name="angle left" />, icon: true }}
            nextItem={{ content: <Icon name="angle right" />, icon: true }}
          />
        </div>
      </Segment>
    );
  }
}

const mapStateToProps = state => (
  {
    agreements: selectors.getAgreements(state),
    isFetchingAgreements: selectors.getIsFetchingAgreements(state),
    agreementPagination: selectors.getAgreementsPagination(state),
    errorGettingAgreements: selectors.getAgreementsErrorMessage(state),
    user: selectors.getUser(state),
    references: selectors.getReferences(state),
    agreementsMapWithAllPlan: selectors.getAgreementsMapWithAllPlan(state),
    isFetchingAgreementWithAllPlan: selectors.getIsFetchingAgreementWithAllPlan(state),
  }
);

export default connect(mapStateToProps, null)(AgreementTable);