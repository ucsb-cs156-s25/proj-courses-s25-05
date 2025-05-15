import React from "react";
import GESearchIndexPage from "main/pages/GeneralEducation/GESearchIndexPage";

// import { geSearchFixtures } from "fixtures/geSearchFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
// import { oneSection } from "fixtures/sectionFixtures";

// import { toast } from "react-toastify";
import { http, HttpResponse } from "msw";

export default {
  title: "pages/GeneralEducation/GESearchIndexPage",
  component: GESearchIndexPage,
};

const Template = () => <GESearchIndexPage />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    // http.get("/api/UCSBSubjects/all", () => {
    //   return HttpResponse.json(ucsbSubjectsFixtures.threeSubjects, {
    //     status: 200,
    //   });
    // }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingBoth, {
        status: 200,
      });
    }),
    http.get("/api/currentUser", () => {
      return HttpResponse.status(403); // returns 403 when not logged in
    }),
  ],
};
