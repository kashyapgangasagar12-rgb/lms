import api from './api';

export const submitReview = (reviewData) => {
    return api.post('/reviews', reviewData);
};

export const getReviewsByCourse = (courseId) => {
    return api.get(`/reviews/course/${courseId}`);
};
