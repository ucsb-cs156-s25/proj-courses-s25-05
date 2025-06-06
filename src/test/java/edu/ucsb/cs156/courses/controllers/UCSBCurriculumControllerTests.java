package edu.ucsb.cs156.courses.controllers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import edu.ucsb.cs156.courses.ControllerTestCase;
import edu.ucsb.cs156.courses.config.SecurityConfig;
import edu.ucsb.cs156.courses.repositories.UserRepository;
import edu.ucsb.cs156.courses.services.UCSBCurriculumService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.AutoConfigureDataJpa;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(value = UCSBCurriculumController.class)
@Import(SecurityConfig.class)
@AutoConfigureDataJpa
public class UCSBCurriculumControllerTests extends ControllerTestCase {

  @MockBean UserRepository userRepository;

  @Autowired private MockMvc mockMvc;

  @MockBean private UCSBCurriculumService ucsbCurriculumService;

  @Test
  public void test_search() throws Exception {
    String expectedResult = "{expectedJSONResult}";
    String urlTemplate = "/api/public/basicsearch?qtr=%s&dept=%s&level=%s";
    String url = String.format(urlTemplate, "20204", "CMPSC", "L");
    when(ucsbCurriculumService.getJSON(any(String.class), any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedResult, responseString);
  }

  @Test
  public void test_finalsInfo() throws Exception {
    String expectedResult = "{expectedJSONResult}";
    String urlTemplate = "/api/public/finalsInfo?quarterYYYYQ=%s&enrollCd=%s";
    String url = String.format(urlTemplate, "20251", "67421");
    when(ucsbCurriculumService.getFinalsInfo(any(String.class), any(String.class)))
        .thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get(url).contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();
    String responseString = response.getResponse().getContentAsString();

    assertEquals(expectedResult, responseString);
  }

  @Test
  public void test_generalEducationInfo() throws Exception {
    String expectedResult = "[{\"code\":\"A1\",\"description\":\"English Reading & Composition\"}]";
    when(ucsbCurriculumService.getGeInfo()).thenReturn(expectedResult);

    MvcResult response =
        mockMvc
            .perform(get("/api/public/generalEducationInfo").contentType("application/json"))
            .andExpect(status().isOk())
            .andReturn();

    String responseString = response.getResponse().getContentAsString();
    assertEquals(expectedResult, responseString);
  }
}
