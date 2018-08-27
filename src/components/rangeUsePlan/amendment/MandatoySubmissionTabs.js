import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Button, Radio, Form, Icon, Checkbox } from 'semantic-ui-react';
import { PLAN_STATUS } from '../../../constants/variables';

const propTypes = {
  clients: PropTypes.arrayOf(PropTypes.object),
  activeTab: PropTypes.number.isRequired,
  isAgreed: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleAgreeCheckBoxChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmitClicked: PropTypes.func.isRequired,
  handleMandatorySubmissionTypeChange: PropTypes.func.isRequired,
};
const defaultProps = {
  clients: [],
};

class MandatoryAmendmentTabs extends Component {
  render() {
    const {
      clients,
      activeTab,
      isAgreed,
      isSubmitting,
      readyToGoNext,
      mandatorySubmissionType,
      onClose,
      onSubmitClicked,
      onBackClicked,
      onNextClicked,
      handleAgreeCheckBoxChange,
      handleMandatorySubmissionTypeChange,
    } = this.props;
    const index = activeTab + 1;

    if (clients.length === 1) {
      return (
        <Fragment>
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 1 })}>
            <Form>
              <div className="multi-form__tab__title">
                {index}. Ready to Submit? Choose Your Submission Type
              </div>
              <Form.Field className="amendment__submission__radio-field">
                <Radio
                  className="amendment__submission__radio"
                  label=""
                  name="radioGroup"
                  value={PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                  checked={mandatorySubmissionType === PLAN_STATUS.SUBMITTED_FOR_REVIEW}
                  onChange={handleMandatorySubmissionTypeChange}
                />
                <div>
                  <b>Submit for Staff Review: </b>
                  Short Description that informs the user that their submission will be reviewed by range staff before they submit for final approval.
                </div>
              </Form.Field>
              <Form.Field className="amendment__submission__radio-field">
                <Radio
                  className="amendment__submission__radio"
                  label=""
                  name="radioGroup"
                  value={PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                  checked={mandatorySubmissionType === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION}
                  onChange={handleMandatorySubmissionTypeChange}
                />
                <div>
                  <b>Submit for Final Decision: </b>
                  Short Description that informs the user that they will be submitting for Final approval and that all Agreement holders will have to review the submission before it is sent to range staff.
                </div>
              </Form.Field>
              <div className="multi-form__btns">
                <Button
                  className="multi-form__btn"
                  onClick={onBackClicked}
                >
                  Back
                </Button>
                <Button
                  className="multi-form__btn"
                  onClick={onNextClicked}
                  disabled={!readyToGoNext}
                >
                  Next
                </Button>
              </div>
            </Form>
          </div>
          { mandatorySubmissionType === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION &&
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
              <div className="multi-form__tab__title">
                {index}. Confirm Your Submission and eSignature
              </div>
              <div style={{ marginBottom: '20px' }}>
                You are about to submit your Mandatory Amendment for your RUP.
              </div>
              <Form.Field>
                <Checkbox
                  label="I understand that this submission constitues a legal document and eSignature. Changes to the current Range Use Plan will be take effect immediatly."
                  onChange={handleAgreeCheckBoxChange}
                />
              </Form.Field>
              <div className="multi-form__btns">
                <Button
                  className="multi-form__btn"
                  onClick={onBackClicked}
                >
                  Back
                </Button>
                <Button
                  className="multi-form__btn"
                  onClick={onSubmitClicked}
                  loading={isSubmitting}
                  disabled={!isAgreed}
                >
                  Submit Amendment
                </Button>
              </div>
            </div>
          }
          { mandatorySubmissionType === PLAN_STATUS.SUBMITTED_FOR_REVIEW &&
            <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 2 })}>
              <Form>
                <div className="multi-form__tab__title">
                  {index}. Submit Your Admendment for Review
                </div>
                <div style={{ marginBottom: '20px' }}>
                  You’re ready to submit mandatory amendment for Range staff review. You will be notified once the submission has been reviewed.
                </div>
                <div className="multi-form__btns">
                  <Button
                    className="multi-form__btn"
                    onClick={onBackClicked}
                  >
                    Back
                  </Button>
                  <Button
                    className="multi-form__btn"
                    onClick={onSubmitClicked}
                    loading={isSubmitting}
                  >
                    Submit For Review
                  </Button>
                </div>
              </Form>
            </div>
          }
          <div className={classnames('multi-form__tab', { 'multi-form__tab--active': activeTab === 3 })}>
            <div className="amendment__submission__last-tab">
              <Icon style={{ marginBottom: '10px' }} name="check circle outline" size="huge" />
              <div className="amendment__submission__last-tab__title">Your mandatory amendment has been sent for range staff review.</div>
              <div style={{ marginBottom: '20px' }}>
                Your mandatory amendment has been sent to Range staff for review. Feel free to call your Range officer if you have any questions!
              </div>
              <Button
                className="multi-form__btn"
                onClick={onClose}
              >
                Finish
              </Button>
            </div>
          </div>
        </Fragment>
      );
    }
    return (
      <div></div>
    );
  }
}

MandatoryAmendmentTabs.propTypes = propTypes;
MandatoryAmendmentTabs.defaultProps = defaultProps;
export default MandatoryAmendmentTabs;
