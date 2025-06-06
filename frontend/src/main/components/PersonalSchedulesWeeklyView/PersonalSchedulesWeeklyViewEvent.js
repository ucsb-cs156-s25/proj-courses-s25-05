import React, { useEffect, useState } from "react";
import { Card, OverlayTrigger, Popover } from "react-bootstrap";

export default function PersonalSectionsEvents({
  event,
  eventColor,
  borderColor,
}) {
  const [style, setStyle] = useState({});
  const testId = "PersonalSectionsEvent";

  // Stryker disable all : simple time conversion functions
  const convertTimeToMinutes = (time) => {
    const [hours, minutes] = [time.slice(0, 2), time.slice(-2)];
    return hours * 60 + minutes * 1;
  };

  const convert24Hourto12Hour = (time) => {
    let [hours, minutes] = [time.slice(0, 2), time.slice(-2)];
    if (hours * 1 > 12) {
      let hTemp = hours * 1 - 12;
      hours = hTemp.toString();
    }
    return hours + ":" + minutes;
  };
  // Stryker restore all

  // Stryker disable all : hard to test for specfic styles
  useEffect(() => {
    const startMinutes = convertTimeToMinutes(event.startTime);
    const endMinutes = convertTimeToMinutes(event.endTime);
    const height = endMinutes - startMinutes;
    const topPosition = startMinutes + 94;

    setStyle({
      event: {
        position: "absolute",
        top: `${topPosition}px`,
        height: `${height}px`,
        width: "100%",
        backgroundColor: eventColor,
        border: `2px solid ${borderColor}`,
        zIndex: 1,
        padding: "2px",
        justifyContent: "center",
        alignItems: "left",
      },
      title: {
        fontSize:
          height < 25
            ? "10px"
            : height < 40
              ? "12px"
              : height < 60
                ? "14px"
                : "16px",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        textAlign: "left",
        margin: "0",
      },
      padding5: {
        padding: "5px",
      },
      height: height,
    });
  }, [event.startTime, event.endTime, eventColor, borderColor]);
  // Stryker restore all

  return (
    <OverlayTrigger
      trigger="click"
      key={event.title}
      placement="auto-start"
      rootClose
      overlay={
        <Popover>
          <Popover.Header as="h3">
            {event.title} - {event.area}
          </Popover.Header>
          <Popover.Body>
            <p data-testid={`${testId}-description`}>
              {event.name}
              <br />
              {event.description}
            </p>
          </Popover.Body>
        </Popover>
      }
    >
      <Card
        key={event.title}
        style={style.event}
        data-testid={`${testId}-${event.id}`}
      >
        <Card.Body style={style.padding5}>
          {style.height >= 20 && (
            <Card.Text data-testid={`${testId}-title`} style={style.title}>
              {event.title}
            </Card.Text>
          )}
          {style.height >= 40 && ( // Stryker disable all : no need to test text formatting
            <Card.Text
              data-testid={`${testId}-time`}
              style={{ fontSize: "12px", textAlign: "left" }}
            >
              {convert24Hourto12Hour(event.startTime)} -{" "}
              {convert24Hourto12Hour(event.endTime)}
            </Card.Text> // Stryker enable all
          )}
        </Card.Body>
      </Card>
    </OverlayTrigger>
  );
}
