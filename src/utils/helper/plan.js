import {
  PLAN_STATUS,
  APPROVED_PLAN_STATUSES,
  EDITABLE_PLAN_STATUSES,
  FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES,
  REQUIRE_NOTES_PLAN_STATUSES,
  NOT_DOWNLOADABLE_PLAN_STATUSES,
  REFERENCE_KEY
} from '../../constants/variables'
import { isAmendment } from './amendment'
import { isPlanAmendment } from '../validation'
import { isUserAgreementHolder } from './user'

const getAmendmentTypeDescription = (amendmentTypeId, amendmentTypes) => {
  if (amendmentTypeId && amendmentTypes) {
    const amendmentType = amendmentTypes.find(at => at.id === amendmentTypeId)
    return amendmentType.description
  }
  return ''
}

export const getPlanTypeDescription = (plan = {}, amendmentTypes) => {
  const { agreementId, amendmentTypeId } = plan
  if (!plan.id) return ''
  if (agreementId && amendmentTypeId) {
    return getAmendmentTypeDescription(amendmentTypeId, amendmentTypes)
  }
  return 'Initial RUP'
}

export const scrollIntoView = elementId => {
  document.getElementById(elementId).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  })
}

export const isStatusCreated = status =>
  status && status.code === PLAN_STATUS.CREATED

export const isStatusDraft = status =>
  status && status.code === PLAN_STATUS.DRAFT

export const isStatusStaffDraft = status =>
  status && status.code === PLAN_STATUS.STAFF_DRAFT

export const isStatusCompleted = status =>
  status && status.code === PLAN_STATUS.COMPLETED

export const isStatusChangedRequested = status =>
  status && status.code === PLAN_STATUS.CHANGE_REQUESTED

export const isStatusPending = status =>
  status && status.code === PLAN_STATUS.PENDING

export const isStatusApproved = status =>
  status && status.code === PLAN_STATUS.APPROVED

export const isStatusNotApproved = status =>
  status && status.code === PLAN_STATUS.NOT_APPROVED

export const isStatusNotApprovedFWR = status =>
  status && status.code === PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED

export const isStatusStands = status =>
  status && status.code === PLAN_STATUS.STANDS

export const isStatusStandsReview = status =>
  status && status.code === PLAN_STATUS.STANDS_REVIEW

export const isStatusStandsWM = status =>
  status && status.code === PLAN_STATUS.STANDS_WRONGLY_MADE

export const isStatusWronglyMakeWE = status =>
  status && status.code === PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT

export const isStatusSubmittedForReview = status =>
  status && status.code === PLAN_STATUS.SUBMITTED_FOR_REVIEW

export const isStatusSubmittedForFD = status =>
  status && status.code === PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION

export const isStatusReadyForFD = status =>
  status && status.code === PLAN_STATUS.READY_FOR_FINAL_DECISION

export const isStatusRecommendReady = status =>
  status && status.code === PLAN_STATUS.RECOMMEND_READY

export const isStatusRecommendNotReady = status =>
  status && status.code === PLAN_STATUS.RECOMMEND_NOT_READY

export const isStatusAwaitingConfirmation = status =>
  status && status.code === PLAN_STATUS.AWAITING_CONFIRMATION

export const isStatusRecommendForSubmission = status =>
  status && status.code === PLAN_STATUS.RECOMMEND_FOR_SUBMISSION

export const cannotDownloadPDF = status =>
  status && status.code && NOT_DOWNLOADABLE_PLAN_STATUSES.includes(status.code)

export const isStatusAmongApprovedStatuses = status =>
  status && status.code && APPROVED_PLAN_STATUSES.includes(status.code)

export const canAllowRevisionForAH = status =>
  status && status.code && EDITABLE_PLAN_STATUSES.includes(status.code)

export const isStatusIndicatingStaffFeedbackNeeded = status =>
  status &&
  status.code &&
  FEEDBACK_REQUIRED_FROM_STAFF_PLAN_STATUSES.includes(status.code)

export const isNoteRequired = statusCode =>
  REQUIRE_NOTES_PLAN_STATUSES.includes(statusCode)

export const canUserSubmitConfirmation = (status, user, confirmations = []) => {
  if (isStatusAwaitingConfirmation(status) && user) {
    let isConfirmed = false
    confirmations.map(confirmation => {
      if (user.clientId && user.clientId === confirmation.clientId) {
        isConfirmed = confirmation.confirmed
      }
      return undefined
    })

    // users who haven't confirmed yet can submit the confirmation
    return !isConfirmed
  }
  return false
}

export const canUserEditThisPlan = (plan = {}, user = {}) => {
  const { status, creatorId } = plan
  if (isPlanAmendment(plan)) {
    if (status && creatorId && user.id) {
      return canAllowRevisionForAH(status) && creatorId === user.id
    }
  } else {
    // initial plan
    return canAllowRevisionForAH(status)
  }

  return false
}

export const findStatusWithCode = (references, statusCode) => {
  if (references && statusCode) {
    const planStatusList = references[REFERENCE_KEY.PLAN_STATUS]
    return planStatusList.find(s => s.code === statusCode)
  }

  return undefined
}

export const getBannerHeaderAndContentForAH = (plan, user) => {
  const { status, amendmentTypeId } = plan
  let header = ''
  let content = ''

  if (isStatusDraft(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Draft in Progress'
      content =
        'This range use plan draft is in progress. Be sure to read through any plan notes left by your assigned range officer. Your changes will not be viewable by range staff until submission.'
    } else {
      header = 'Draft In Progress by AH'
      content =
        'This range use plan draft is being worked on by the agreement holder. Some content may not be visible until agreement holder has submitted it to Range Staff.'
    }
  }
  if (isStatusCreated(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Add Content to Draft Range Use Plan'
      content =
        'Please add content to this draft Range Use Plan. Read through any plan notes left by the assigned staff contact below. Make changes to the content on this screen and select "Save Draft" or "Submit" once completed. Your changes will not be viewable by range staff until submission.'
    } else {
      header = 'Submitted to AH for Input'
      content = `This ${
        isAmendment(amendmentTypeId) ? 'amendment' : 'range use plan'
      } has been submitted to the agreement holder for input. You will be notified when a submission is received.`
    }
  }
  if (isStatusChangedRequested(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Range Staff Have Requested Changes'
      content =
        'Range staff have requested changes to your submission. Read through any plan notes left by the assigned staff contact below. Make changes to the content on this screen and select "Save Draft" or "Submit" once completed. Your changes will not be viewable by range staff until submission.'
    } else {
      header = 'Submitted to AH for Changes'
      content =
        'This range use plan has been submitted to the agreement holder for changes. You can view the details of the requested changes in the plan notes below. You will be notified when a submission is received.'
    }
  }
  if (isStatusStaffDraft(status)) {
    header = 'Staff Draft (Synced from iOS)'
    content =
      'This range use plan draft is currently in progress and synced to the server. Use the "Save" button to save your draft or "Submit" when ready for the agreement holder to add content.'
  }
  if (isStatusWronglyMakeWE(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Minor Amendment Not Accepted'
      content =
        'This minor amendment did not meet requirements and cannot remain in place. Your previously approved range use plan will remain the current legal version.'
    } else {
      header = 'Minor Amendment - Wrongly Made Without Effect'
      content =
        'This range use plan minor amendment was wrongly made and is without effect. The previously approved range use plan will be the current legal version.'
    }
  }
  if (isStatusWronglyMakeWE(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Minor Amendment Not Accepted'
      content =
        'This minor amendment did not meet requirements and cannot remain in place. Your previously approved range use plan will remain the current legal version.'
    } else {
      header = 'Minor Amendment - Wrongly Made Without Effect'
      content =
        'This range use plan minor amendment was wrongly made and is without effect. The previously approved range use plan will be the current legal version.'
    }
  }
  if (isStatusStandsWM(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Minor Amendment Accepted with Errors'
      content =
        'This minor amendment did not meet requirements but will be allowed to be remain in place. This amended range use plan is now the current legal version.'
    } else {
      header = 'Minor Amendment - Wrongly Made Stands'
      content =
        'This minor amendment was deemed wrongly made but stands. This amended range use plan is now the current legal version.'
    }
  }
  if (isStatusStandsReview(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Minor Amendment Accepted'
      content =
        'This range use plan minor amendment is now the current legal version. It may be reviewed by range staff to confirm that it meets requirements.'
    } else {
      header = 'Minor Amendment - Review Required'
      content =
        'This minor amendment was submitted and will be the current legal version unless you review and the decision maker deems it wrongly made.'
    }
  }
  if (isStatusStands(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Minor Amendment Accepted'
      content =
        'This range use plan minor amendment meets requirements. This amended range use plan is now the current legal version.'
    } else {
      header = 'Minor Amendment - Stands'
      content =
        'This minor amendment was reviewed, meets requirements and is the current legal version.'
    }
  }
  if (isStatusSubmittedForReview(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Awaiting Feedback from Range Staff'
      content =
        'Staff were asked to provide feedback on this submission. You will be notified when the review is complete.'
    } else {
      header = `Provide ${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } Feedback`
      content = `The agreement holder has requested your feedback for this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } Use the Plan Actions menu to respond to the agreement holder by selecting "Request Changes" or "Recommend For Submission".`
    }
  }
  if (isStatusSubmittedForFD(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Awaiting Final Decision'
      content =
        'This plan has been submitted for final decision. You will be notified if a decision has been made or if more changes are needed.'
    } else {
      header = `${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } Decision Required`
      content = `This ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } has been submitted for final decision. If change are required select "Request Changes" from the Plan Actions menu. If the plan is ready for decision prepare your recommendation package. Once submitted to the decision maker select "Recommend Ready" or "Recommend not Ready" in the Plan Actions menu to reflect your recommendation.`
    }
  }
  if (isStatusAwaitingConfirmation(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Awaiting Signatures'
      content = `This ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } submission process has been started and is awaiting confirmation from all agreement holders. Once all signatures have been received it will be sent to Range staff for final decision.`
    } else {
      header = `${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } AH Signatures Pending`
      content = `This ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      }'s submission process has been started and is awaiting signatures from all agreement holders. You will be notified when the submission is ready for review.`
    }
  }
  if (isStatusRecommendForSubmission(status)) {
    if (isUserAgreementHolder(user)) {
      header = `Your ${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } is ready for final decision`
      content = `Staff have reviewed this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } and recommend that it be submitted for final decision. Select "Submit" to begin the submission process.`
    } else {
      header = 'Recommended for Submission'
      content = `A staff person has provided feedback to the agreement holder that this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } is ready for final signatures and decision. You will be notified when it has been signed and submitted.`
    }
  }
  if (isStatusRecommendReady(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Awaiting Final Decision'
      content =
        'This plan has been submitted for final decision. You will be notified if a decision has been made or if more changes are needed.'
    } else {
      header = `${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } - Recommended Ready`
      content = `Staff have recommended to the decision maker that this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } be approved. You will be notified when the decision has been made. If the ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } is not approved you must notify the AH before recording the decision in the Plan Actions menu.`
    }
  }
  if (isStatusRecommendNotReady(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Awaiting Final Decision'
      content =
        'This plan has been submitted for final decision. You will be notified if a decision has been made or if more changes are needed.'
    } else {
      header = `${
        isAmendment(amendmentTypeId)
          ? 'Mandatory Amendment'
          : 'Initial Range Use Plan'
      } - Recommended Not Ready`
      content = `Staff have recommended to the decision maker that this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } not be approved. You will be notified when the decision has been made. If the ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } is not approved you must notify the AH before recording the decision in the Plan Actions menu.  `
    }
  }
  if (isStatusNotApprovedFWR(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Changes Requested'
      content =
        'The decision maker has requested changes to your plan. Please review the plan notes and make the requested changes prior to submission.'
    } else {
      header = 'Plan Not Approved - Further Work Required'
      content = `The agreement holder has been notified that this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } is not approved and further work is required.  You will be notified when a submission is received.`
    }
  }
  if (isStatusNotApproved(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Range Use Plan Not Approved'
      content =
        'This range use plan was not approved by the decision maker. Please refer to the plan notes or contact your assigned range officer for more information.'
    } else {
      header = 'Plan Not Approved'
      content =
        'The agreement holder has been notified that this *intial range use plan*/ *mandatory amendment * is not approved. The previously approved range use plan will be the current legal version.'
    }
  }
  if (isStatusApproved(status)) {
    if (isUserAgreementHolder(user)) {
      header = 'Range Use Plan Approved'
      content = 'This range use plan has been approved by the decision maker.'
    } else {
      header = 'Plan Approved'
      content = `The agreement holder has been notified that this ${
        isAmendment(amendmentTypeId)
          ? 'mandatory amendment'
          : 'initial range use plan'
      } * is approved.`
    }
  }

  return { header, content }
}
