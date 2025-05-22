import React from "react";

import PersonalSchedulesDetailsPage from "main/pages/PersonalSchedules/PersonalSchedulesDetailsPage";
import { personalScheduleFixtures } from "fixtures/personalScheduleFixtures";
import { personalSectionsFixtures } from "fixtures/personalSectionsFixtures";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/PersonalSchedules/PersonalSchedulesDetailsPage",
  component: PersonalSchedulesDetailsPage,
};

const Template = () => <PersonalSchedulesDetailsPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.adminUser, {
        status: 200,
      });
    }),
    http.post("/logout", ({ request }) => {
      toast(`Generated: ${request.method} ${request.url}`);
      return HttpResponse.json(
        {},
        {
          status: 200,
        },
      );
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/personalschedules", () => {
      return HttpResponse.json(
        personalScheduleFixtures.onePersonalScheduleMatching,
        {
          status: 200,
        },
      );
    }),
    http.get("/api/personalschedules/all", () => {
      return HttpResponse.json(
        personalSectionsFixtures.threePersonalSections,
        {
          status: 200,
        },
      );
    }),
  ],
};
