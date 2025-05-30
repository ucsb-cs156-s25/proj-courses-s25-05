import { useState } from "react";
import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import GeneralEducationSearchForm from "main/components/GeneralEducation/GeneralEducationSearchForm";
import SectionsTable from "main/components/Sections/SectionsTable";
import { useBackendMutation } from "main/utils/useBackend";

// Stryker disable all
export default function GeneralEducationSearchPage() {
  const [sectionJSON, setSectionJSON] = useState([]);

  const objectToAxiosParams = (query) => ({
    // TO-DO: Implement the API call to fetch sections based on the GE area
    url: "/api/sections/generaleducationsearch",
    method: "GET",
    params: {
      area: query.area,
    },
  });

  // Callback function to update state with fetched sections
  const onSuccess = (sections) => {
    setSectionJSON(sections);
  };

  // Hook to handle the backend API mutation (search)
  const mutation = useBackendMutation(objectToAxiosParams, { onSuccess }, []);

  // Function to trigger the API call, passed to the search form
  async function fetchGeneralEducationSectionsJSON(_event, query) {
    mutation.mutate(query);
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h5>Search by General Education Area</h5>
        <GeneralEducationSearchForm
          fetchJSON={fetchGeneralEducationSectionsJSON}
        />
        <SectionsTable sections={sectionJSON} />
      </div>
    </BasicLayout>
  );
}
