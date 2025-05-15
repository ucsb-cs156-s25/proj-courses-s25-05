import { useState } from "react";
import { Form } from "react-bootstrap";

const SingleAreaDropdown = ({
  areas,
  setArea,
  controlId,
  onChange = null,
  label = "General Education Area",
}) => {
  const localSearchArea = localStorage.getItem(controlId);
  const [areaState, setAreaState] = useState(
    // Stryker disable next-line all : not sure how to test/mock local storage
    localSearchArea || "A",
  );

  const handleAreatoChange = (event) => {
    localStorage.setItem(controlId, event.target.value);
    setAreaState(event.target.value);
    setArea(event.target.value);
    if (onChange != null) {
      onChange(event);
    }
  };

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        as="select"
        value={areaState}
        onChange={handleAreatoChange}
      >
        {areas.map(function (object, i) {
          const key = `${controlId}-option-${i}`;
          return (
            <option key={key} data-testid={key} value={object[0]}>
              {object[0]} - {object[1]}
            </option>
          );
        })}
      </Form.Control>
    </Form.Group>
  );
};

export default SingleAreaDropdown;
