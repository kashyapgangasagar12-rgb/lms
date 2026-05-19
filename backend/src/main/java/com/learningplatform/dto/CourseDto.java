package com.learningplatform.dto;

import lombok.*;

/**
 * Course DTO for listing courses with Udemy-like metadata.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDto {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private Long instructorId;
    private String instructorName;
    private String learningObjectives;

    private Double rating;
    private String category;
    private Integer lessonCount;
    private Long reviewCount;
}
