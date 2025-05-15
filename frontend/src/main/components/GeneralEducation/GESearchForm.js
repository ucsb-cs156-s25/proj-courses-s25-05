import { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

import { allTheAreas } from "fixtures/areaFixtures";

// import { useSystemInfo } from "main/utils/systemInfo";
import SingleAreaDropdown from "main/components/Areas/SingleAreaDropdown";
// import { useBackend } from "main/utils/useBackend";

const GESearchForm = ({ fetchJSON }) => {
  // const { data: systemInfo } = useSystemInfo();

  // Stryker disable all : not sure how to test/mock local storage
  const localArea = localStorage.getItem("GeneralEducationSearch.Area");

  // This is Jim's part
  // For now, we are using a hardcoded fixture
  // const {
  //   data: areas,
  //   error: _error,
  //   status: _status,
  // } = useBackend(
  //   // Stryker disable next-line all : don't test internal caching of React Query
  //   ["/api/UCSBGEAreas/all"],
  //   { method: "GET", url: "/api/UCSBGEAreas/all" },        // ADJUST FINAL API NAME
  //   [],
  // );

  const [area, setArea] = useState(localArea || "A");

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchJSON(event, { area });
  };

  // Stryker disable all : Stryker is testing by changing the padding to 0. But this is simply a visual optimization as it makes it look better
  return (
    <Form onSubmit={handleSubmit}>
      <Container>
        <Row>
          <Col md="auto">
            <SingleAreaDropdown
              areas={allTheAreas}
              area={area}
              setArea={setArea}
              controlId={"GeneralEducationSearch.Area"}
            />
          </Col>
        </Row>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="auto">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default GESearchForm;
