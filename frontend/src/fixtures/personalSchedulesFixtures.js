const personalSchedulesFixtures = {
  onePersonalSchedule: {
    id: 1,
    name: "TestName",
    description: "TestDescription",
    quarter: "W08",
  },
  twoPersonalSchedules: [
    {
      id: 1,
      name: "TestName1",
      description: "TestDescription1",
      quarter: "S08",
    },
    {
      id: 2,
      name: "TestName2",
      description: "TestDescription2",
      quarter: "W09",
    },
    {
      id: 3,
      name: "TestName3",
      description: "TestDescription3",
      quarter: "S12",
    },
  ],
  onePersonalScheduleMatching: {
    //matching ThreePersonalSections from personalSectionsFixtures.js
    id: 1,
    name: "ThreePersonalSectionsSchedule",
    description:
      "Matches threePersonalSections from personalSectionsFixtures.js",
    quarter: "W21",
  },
};

export { personalSchedulesFixtures };
