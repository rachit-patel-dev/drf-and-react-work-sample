import useLanguage from "./useLanguage";

const useOptions = () => {
  const { convertText } = useLanguage();

  const priorityOptions = [
    { value: "high", label: convertText("high") },
    { value: "medium", label: convertText("medium") },
    { value: "low", label: convertText("low") },
  ];

  const priorityFilterOptions = [
    {
      text: convertText("high"),
      value: "high",
    },
    {
      text: convertText("medium"),
      value: "medium",
    },
    {
      text: convertText("low"),
      value: "low",
    },
  ];

  const documentPriorityOptions = [
    { value: "High", label: convertText("high") },
    { value: "Medium", label: convertText("medium") },
    { value: "Low", label: convertText("low") },
  ];

  const documentPriorityFilterOptions = [
    {
      text: convertText("high"),
      value: "High",
    },
    {
      text: convertText("medium"),
      value: "Medium",
    },
    {
      text: convertText("low"),
      value: "Low",
    },
  ];

  const ProcessStatusOptions = [
    { value: "IT Supported", label: `${convertText("itSupported")}` },
    { value: "Aligned", label: `${convertText("aligned")}` },
    { value: "Not Defined", label: `${convertText("notDefined")}` },
    { value: "Implemented", label: `${convertText("implemented")}` },
  ];

  const ProcessStatusFilters = [
    {
      text: `${convertText("itSupported")}`,
      value: "IT Supported",
    },
    {
      text: `${convertText("aligned")}`,
      value: "Aligned",
    },
    {
      text: `${convertText("notDefined")}`,
      value: "Not Defined",
    },
    {
      text: `${convertText("implemented")}`,
      value: "Implemented",
    },
  ];

  const objectiveTypeOptions = [
    { label: `${convertText("company")}`, value: "Company" },
    { label: `${convertText("division")}`, value: "Division" },
    { label: `${convertText("individual")}`, value: "Individual" },
  ];

  const initiativeStatusoptions = [
    { value: "active", label: convertText("active") },
    { value: "done", label: convertText("done") },
    { value: "paused", label: convertText("paused") },
    { value: "backlog", label: convertText("backlog") },
    { value: "cancelled", label: convertText("cancelled") },
  ];

  const initiativeStatusFilteroptions = [
    { value: "active", text: convertText("active") },
    { value: "done", text: convertText("done") },
    { value: "paused", text: convertText("paused") },
    { value: "backlog", text: convertText("backlog") },
    { value: "cancelled", text: convertText("cancelled") },
  ];

  const graphFrequencyOptions = [
    {
      label: convertText("daily"),
      value: "daily",
    },
    {
      label: convertText("weekly"),
      value: "weekly",
    },
    {
      label: convertText("monthly"),
      value: "monthly",
    },
    {
      label: convertText("quarterly"),
      value: "quarterly",
    },
    {
      label: convertText("yearly"),
      value: "yearly",
    },
  ];

  const documentStatusFilteroptions = [
    { value: "Private", text: convertText("private") },
    { value: "Shared", text: convertText("shared") },
  ];

  const documentStatusoptions = [
    { value: "Private", label: convertText("private") },
    { value: "Shared", label: convertText("shared") },
  ];

  const activityRecordFilters = [
    { value: "done", text: convertText("done") },
    { value: "open", text: convertText("open") },
  ];

  const recurringActivityFilterOptions = [
    { value: "Weekly", text: convertText("weekly") },
    { value: "Monthly", text: convertText("monthly") },
    { value: "Quarterly", text: convertText("quarterly") },
    { value: "Yearly", text: convertText("yearly") },
  ];

  const monthNameByNumbers: any = {
    1: convertText("january"),
    2: convertText("february"),
    3: convertText("march"),
    4: convertText("april"),
    5: convertText("may"),
    6: convertText("june"),
    7: convertText("july"),
    8: convertText("august"),
    9: convertText("september"),
    10: convertText("october"),
    11: convertText("november"),
    12: convertText("december"),
  };

  const planningFrequencyOption = [
    {
      value: "yearly",
      label: `${convertText("yearly")}`,
    },
    {
      value: "monthly",
      label: `${convertText("monthly")}`,
    },
    {
      value: "weekly",
      label: `${convertText("weekly")}`,
    },
    {
      value: "daily",
      label: `${convertText("daily")}`,
    },
  ];

  return {
    priorityOptions,
    priorityFilterOptions,
    documentPriorityOptions,
    documentPriorityFilterOptions,
    ProcessStatusOptions,
    ProcessStatusFilters,
    objectiveTypeOptions,
    initiativeStatusoptions,
    graphFrequencyOptions,
    documentStatusFilteroptions,
    documentStatusoptions,
    activityRecordFilters,
    initiativeStatusFilteroptions,
    recurringActivityFilterOptions,
    monthNameByNumbers,
    planningFrequencyOption,
  };
};

export default useOptions;
