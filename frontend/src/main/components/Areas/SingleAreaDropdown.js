import { useState } from "react";
import { Form } from "react-bootstrap";

// showAll is defaulted to false, to ensure the "ALL" option
// doesn't showdown to pre-existing dropdowns

const SingleAreaDropdown = ({
  areas,
  setArea,
  controlId,
  onChange = null,
  label = "General Education Area",
  showAll = false,
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

  areas.sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      <Form.Control as="select" value={areaState} onChange={handleAreatoChange}>
        {showAll && (
          <option data-testid={`${controlId}-option-all`} value="ALL">
            ALL
          </option>
        )}
        {areas.map(function (object) {
          const key = `${controlId}-option-${object[0]}`;
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
