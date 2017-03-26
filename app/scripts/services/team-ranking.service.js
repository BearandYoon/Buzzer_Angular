angular
	.module('bzrdashApp')
	.service('teamRankingService', ['$http', 'StaffService', 'FeedbacksService', 'QuestionsService','$q',
		function ($http, StaffService,FeedbacksService, QuestionsService, $q) {

			var teamRankingService = {};

			teamRankingService.getData = function () {
				var staffServicePromise = StaffService.getStaff();
				var feedbacksServicePromise = FeedbacksService.getFeedbacksContent();
				return $q.all([staffServicePromise, feedbacksServicePromise]).then(function (data) {
					var staffList = data[0];
					var feedbacks = data[1].feedbacks;

					var feedbackGroups = {};
					feedbacks.forEach(function (feedback) {
						if (!feedbackGroups.hasOwnProperty(feedback.formID)) {
							feedbackGroups[feedback.formID] = {
								question: {}
							};
						}
						if (!feedbackGroups[feedback.formID].question.hasOwnProperty('staffmember')
							&& feedback.type === 'server') {
							feedbackGroups[feedback.formID].question['staffmember'] = {
								question: feedback.question,
								tResponse: feedback.tResponse,
								nResponse: feedback.nResponse
							}
						}
						if (!feedbackGroups[feedback.formID].question.hasOwnProperty('serviceRate')
							&& feedback.type === 's') {
							feedbackGroups[feedback.formID].question['serviceRate'] = {
								question: feedback.question,
								tResponse: feedback.tResponse,
								nResponse: feedback.nResponse
							}
						}
						if (!feedbackGroups[feedback.formID].question.hasOwnProperty('comment')
							&& feedback.type === 't') {
							feedbackGroups[feedback.formID].question['comment'] = {
								question: feedback.question,
								tResponse: feedback.tResponse,
								nResponse: feedback.nResponse
							}
						}

						if (!feedbackGroups[feedback.formID].question.hasOwnProperty('nps')
							&& feedback.type === 'nps') {
							feedbackGroups[feedback.formID].question['nps'] = {
								question: feedback.question,
								tResponse: feedback.tResponse,
								nResponse: feedback.nResponse
							}
						}
					});
					staffMaxnps = 0;
					staffMaxnpsIndex = 0;
					staffMaxfeedback = 0;
					staffMaxfeedbackIndex = 0;
                    staffMaxService = 0;
                    staffMaxServiceIndex = 0;
					staffList.forEach(function (staff, index) {
						staff.comments = [];
						staff.feedbackCount = 0;
						staff.serviceRatingsCount = 0;
						staff.serviceRatingTotal = 0;
						staff.npsTotalCount = 0;
						staff.npsPromotersCount = 0;
						staff.npsDetractorsCount = 0;
						staff.award = '';
						for (i in feedbackGroups) {
							if (feedbackGroups.hasOwnProperty(i)) {
								var feedback = feedbackGroups[i];
								if (feedback.question.staffmember
									&& feedback.question.staffmember.tResponse
									&& feedback.question.staffmember.tResponse.search(staff.fname) !== -1) {
									staff.feedbackCount ++;
									if (feedback.question.serviceRate
										&& feedback.question.serviceRate.nResponse) {
										staff.serviceRatingsCount ++;
										staff.serviceRatingTotal += feedback.question.serviceRate.nResponse*1;
									}
									if (feedback.question.nps
										&& feedback.question.nps.nResponse) {
										if (feedback.question.nps.nResponse < 7) {
											staff.npsDetractorsCount++;
										} else if (feedback.question.nps.nResponse > 8) {
											staff.npsPromotersCount++;
										}
										staff.npsTotalCount++;
									}
									if (feedback.question.comment && feedback.question.comment.tResponse !== '') {
										staff.comments.push({
											comment: feedback.question.comment.tResponse
										});
									}
								}
							}
						}
						if (staff.serviceRatingsCount > 0) {
							staff.serviceRatingAvg = staff.serviceRatingTotal/staff.serviceRatingsCount;
						} else {
							staff.serviceRatingAvg = 0;
						}
						if (staff.npsTotalCount>0) {
						    staff.nps = (staff.npsPromotersCount-staff.npsDetractorsCount)/staff.npsTotalCount*100;
						} else {
							staff.nps = 0;
						}
						if (staff.nps > staffMaxnps) {
							staffMaxnps = staff.nps;
							staffMaxnpsIndex = index;
						}
						if (staff.feedbackCount > staffMaxfeedback) {
							staffMaxfeedback = staff.feedbackCount;
							staffMaxfeedbackIndex = index;
						}
                        if (staff.serviceRatingAvg > staffMaxService) {
                            staffMaxService = staff.serviceRatingAvg;
                            staffMaxServiceIndex = index;
                        }
					});
					if (staffMaxnps > 0) {
						staffList[staffMaxnpsIndex].award += ' Top NPS!';
					}
					if (staffMaxfeedback>0) {
						staffList[staffMaxfeedbackIndex].award += ' Highest amount of feedback!';
					}
					if (staffMaxService > 0) {
						staffList[staffMaxServiceIndex].award += ' Best rated staff member!';
					}
					return staffList;
				})
			}
			return teamRankingService;
		}]);
