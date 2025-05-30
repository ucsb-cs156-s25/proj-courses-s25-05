package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import edu.ucsb.cs156.courses.collections.ConvertedSectionCollection;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.documents.ConvertedSection;
import edu.ucsb.cs156.courses.documents.CourseInfo;
import edu.ucsb.cs156.courses.documents.Section;
import edu.ucsb.cs156.courses.documents.TimeLocation;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = CourseBuildingRoomController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class CourseBuildingRoomControllerTests {
  private ObjectMapper mapper = new ObjectMapper();

  @Autowired private MockMvc mockMvc;

  @MockBean ConvertedSectionCollection convertedSectionCollection;

  @Test
  public void test_search_emptyRequest() throws Exception {
    // Arrange: Define the expected result (empty list of room numbers)
    List<ConvertedSection> expectedRoomNumbers =
        new ArrayList<>(); // Empty list for the empty database scenario

    // Define the URL with parameters: targetQtr, buildingCode
    String urlTemplate =
        "/api/public/coursebuildingroom/buildingroomsearch?targetQtr=%s&buildingCode=%s";
    String url =
        String.format(
            urlTemplate, "20221", "GIRV"); // Querying for targetQtr "20221" and building "GIRV"

    // Mock the repository to return an empty list for the empty database scenario
    when(convertedSectionCollection.findByQuarterAndBuildingCode("20221", "GIRV"))
        .thenReturn(expectedRoomNumbers); // Simulate an empty database (no sections)

    // Act: Perform the HTTP GET request
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk()) // Expecting HTTP 200 OK status
            .andReturn();

    // Extract room numbers from the mocked response (which will be an empty list)
    List<String> actualRoomNumbers = new ArrayList<>();

    // Since the database is empty, we don’t expect any room numbers in the result
    // Extracting room numbers from the mock result (empty list in this case)
    // No actual data, so actualRoomNumbers will remain empty

    // Assert: Validate that the response body matches the expected empty list of room numbers
    String responseString = response.getResponse().getContentAsString();
    String expectedString = mapper.writeValueAsString(expectedRoomNumbers); // Empty list

    assertEquals(
        expectedString,
        responseString); // Validate that the response is an empty list of room numbers
  }

  @Test
  public void test_search_validRequestWithoutSuffix() throws Exception {
    // Arrange: Create CourseInfo and Section objects
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC 24")
            .title("Object-Oriented Design")
            .description("Intro to object-oriented design")
            .build();

    // Create sections for each course
    Section section1 = new Section();
    section1.setTimeLocations(
        Arrays.asList(
            TimeLocation.builder().building("GIRV").room("101").build(), // Building GIRV, Room 101
            TimeLocation.builder().building("GIRV").room("102").build() // Building GIRV, Room 102
            ));

    Section section2 = new Section();
    section2.setTimeLocations(
        Arrays.asList(
            TimeLocation.builder().building("GIRV").room("103").build(), // Building GIRV, Room 103
            TimeLocation.builder().building("GIRV").room("104").build() // Building GIRV, Room 104
            ));

    // Create ConvertedSection objects with the sections
    ConvertedSection cs1 = ConvertedSection.builder().courseInfo(info).section(section1).build();
    ConvertedSection cs2 = ConvertedSection.builder().courseInfo(info).section(section2).build();

    // Prepare the URL with valid parameters (targetQtr and buildingCode)
    String urlTemplate =
        "/api/public/coursebuildingroom/buildingroomsearch?targetQtr=%s&buildingCode=%s";
    String url =
        String.format(
            urlTemplate, "20221", "GIRV"); // Querying for targetQtr "20221" and building "GIRV"

    // Mock the repository to return the above ConvertedSection objects
    List<ConvertedSection> expectedSecs = Arrays.asList(cs1, cs2);
    when(convertedSectionCollection.findByQuarterAndBuildingCode("20221", "GIRV"))
        .thenReturn(expectedSecs);

    // Act: Perform the HTTP GET request to the /buildingroomsearch endpoint
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk()) // Expecting HTTP 200 OK status
            .andReturn();

    // Extract room numbers from the mocked response (ConvertedSection objects)
    List<String> actualRoomNumbers = new ArrayList<>();
    for (ConvertedSection section : expectedSecs) {
      for (TimeLocation timeLocation : section.getSection().getTimeLocations()) {
        actualRoomNumbers.add(timeLocation.getRoom());
      }
    }

    // Convert the list of actual room numbers into a JSON string to compare with the response
    String expectedString = mapper.writeValueAsString(actualRoomNumbers);
    String responseString = response.getResponse().getContentAsString();

    // Assert: Validate that the response body matches the expected room numbers in JSON format
    assertEquals(
        expectedString,
        responseString); // Validate that the response matches the extracted room numbers
  }

  @Test
  public void test_search_courseWithNoRoomNumber() throws Exception {
    // Arrange: Create CourseInfo and Section objects (with no room numbers in timeLocations)
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC 24")
            .title("Object-Oriented Design")
            .description("Intro to object-oriented design")
            .build();

    // Create section with no room numbers
    Section section = new Section();
    section.setTimeLocations(new ArrayList<>()); // No timeLocations (no room numbers)

    // Create ConvertedSection with the section (no rooms)
    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    // Prepare the URL with valid parameters (targetQtr and buildingCode)
    String urlTemplate =
        "/api/public/coursebuildingroom/buildingroomsearch?targetQtr=%s&buildingCode=%s";
    String url =
        String.format(
            urlTemplate, "20222", "GIRV"); // Querying for targetQtr "20222" and building "GIRV"

    // Mock the repository to return the above ConvertedSection (with no room numbers)
    List<ConvertedSection> expectedSecs = Arrays.asList(cs);
    when(convertedSectionCollection.findByQuarterAndBuildingCode("20222", "GIRV"))
        .thenReturn(expectedSecs);

    // Act: Perform the HTTP GET request to the /buildingroomsearch endpoint
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk()) // Expecting HTTP 200 OK status
            .andReturn();

    // Extract room numbers from the mocked response (which will be an empty list)
    List<String> actualRoomNumbers = new ArrayList<>();
    for (ConvertedSection sectionItem : expectedSecs) {
      for (TimeLocation timeLocation : sectionItem.getSection().getTimeLocations()) {
        actualRoomNumbers.add(timeLocation.getRoom());
      }
    }

    // Since there are no room numbers, actualRoomNumbers should remain empty
    // Assert: Validate that the response body matches an empty list
    String expectedString = mapper.writeValueAsString(actualRoomNumbers); // Empty list
    String responseString = response.getResponse().getContentAsString();

    assertEquals(
        expectedString,
        responseString); // Validate that the response is an empty list of room numbers
  }

  @Test
  public void test_search_courseWithNullRoomNumber() throws Exception {
    // Arrange: Create CourseInfo and Section objects (with null room number in timeLocations)
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC 24 -1")
            .title("Object-Oriented Design")
            .description("Intro to object-oriented design")
            .build();

    // Create section with a timeLocation that has a null room number
    Section section = new Section();
    section.setTimeLocations(
        Arrays.asList(
            TimeLocation.builder()
                .building("GIRV")
                .room(null)
                .build() // Room is null for this timeLocation
            ));

    // Create ConvertedSection with the section (room number is null)
    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    // Prepare the URL with valid parameters (targetQtr and buildingCode)
    String urlTemplate =
        "/api/public/coursebuildingroom/buildingroomsearch?targetQtr=%s&buildingCode=%s";
    String url =
        String.format(
            urlTemplate, "20222", "GIRV"); // Querying for targetQtr "20222" and building "GIRV"

    // Mock the repository to return the above ConvertedSection (with null room number)
    List<ConvertedSection> expectedSecs = Arrays.asList(cs);
    when(convertedSectionCollection.findByQuarterAndBuildingCode("20222", "GIRV"))
        .thenReturn(expectedSecs);

    // Act: Perform the HTTP GET request to the /buildingroomsearch endpoint
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk()) // Expecting HTTP 200 OK status
            .andReturn();

    // Extract room numbers from the mocked response (which will be an empty list due to null room
    // number)
    List<String> actualRoomNumbers = new ArrayList<>();
    for (ConvertedSection sectionItem : expectedSecs) {
      for (TimeLocation timeLocation : sectionItem.getSection().getTimeLocations()) {
        if (timeLocation.getRoom() != null) {
          actualRoomNumbers.add(timeLocation.getRoom());
        }
      }
    }

    // Since the room number is null, actualRoomNumbers should remain empty
    // Assert: Validate that the response body matches an empty list
    String expectedString = mapper.writeValueAsString(actualRoomNumbers); // Empty list
    String responseString = response.getResponse().getContentAsString();

    assertEquals(
        expectedString,
        responseString); // Validate that the response is an empty list of room numbers
  }

  @Test
  public void test_search_courseWithEmptyRoomNumber() throws Exception {
    // Arrange: Create CourseInfo and Section objects (with an empty room number)
    CourseInfo info =
        CourseInfo.builder()
            .quarter("20222")
            .courseId("CMPSC 24 -1")
            .title("Object-Oriented Design")
            .description("Intro to object-oriented design")
            .build();

    // Create section with a timeLocation that has an empty room number
    Section section = new Section();
    section.setTimeLocations(
        Arrays.asList(
            TimeLocation.builder()
                .building("GIRV")
                .room("")
                .build() // Non-null but empty string for the room number
            ));

    // Create ConvertedSection with the section (room number is an empty string)
    ConvertedSection cs = ConvertedSection.builder().courseInfo(info).section(section).build();

    // Prepare the URL with valid parameters (targetQtr and buildingCode)
    String urlTemplate =
        "/api/public/coursebuildingroom/buildingroomsearch?targetQtr=%s&buildingCode=%s";
    String url =
        String.format(
            urlTemplate, "20222", "GIRV"); // Querying for targetQtr "20222" and building "GIRV"

    // Mock the repository to return the above ConvertedSection (with empty room number)
    List<ConvertedSection> expectedSecs = Arrays.asList(cs);
    when(convertedSectionCollection.findByQuarterAndBuildingCode("20222", "GIRV"))
        .thenReturn(expectedSecs);

    // Act: Perform the HTTP GET request to the /buildingroomsearch endpoint
    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk()) // Expecting HTTP 200 OK status
            .andReturn();

    // Extract room numbers from the mocked response (which will not contain the empty room number)
    List<String> actualRoomNumbers = new ArrayList<>();
    for (ConvertedSection sectionItem : expectedSecs) {
      for (TimeLocation timeLocation : sectionItem.getSection().getTimeLocations()) {
        if (timeLocation.getRoom() != null && !timeLocation.getRoom().isEmpty()) {
          actualRoomNumbers.add(timeLocation.getRoom());
        }
      }
    }

    // Assert: Verify that the list of room numbers is empty, because the room number is an empty
    // string
    String expectedString = mapper.writeValueAsString(actualRoomNumbers); // Should be an empty list
    String responseString = response.getResponse().getContentAsString();

    assertEquals(
        expectedString,
        responseString); // Validate that the response is an empty list of room numbers
  }
}
