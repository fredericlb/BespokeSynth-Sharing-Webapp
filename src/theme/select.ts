import { GroupBase, StylesConfig } from "react-select";

const SELECT_HEIGHT = 25;

const customStyles: StylesConfig<
  {
    value: string;
    label: string;
  },
  true,
  GroupBase<{
    value: string;
    label: string;
  }>
> = {
  menu: (provided) => ({
    ...provided,
    width: "200px",
    background: "black",
  }),

  menuList: (provided) => ({
    ...provided,
  }),

  option: (provided, state) => {
    let background = "transparent";
    if (state.isFocused) {
      background = "#676767";
    } else if (state.isSelected) {
      background = "#343434";
    }
    return {
      ...provided,
      background,
    };
  },

  container: (provided) => ({
    ...provided,
    minHeight: SELECT_HEIGHT,
  }),

  control: (provided) => ({
    ...provided,
    width: "200px",
    background: "transparent",
    borderRadius: 0,
    minHeight: SELECT_HEIGHT,
  }),

  multiValue: (provided) => ({
    ...provided,
    background: "transparent",
    border: "1px solid #676767",
    borderRadius: 0,
  }),

  multiValueLabel: (provided) => ({
    ...provided,
    color: "#ababab",
    textTransform: "lowercase",
    padding: 4,
    fontSize: ".8rem",
  }),

  multiValueRemove: () => ({
    opacity: 0.6,
    paddingTop: 3,
  }),

  indicatorSeparator: () => ({ display: "none" }),

  indicatorsContainer: () => ({
    height: SELECT_HEIGHT,
    padding: 0,
  }),

  dropdownIndicator: () => ({
    padding: 3,
  }),

  valueContainer: (provided) => ({
    ...provided,
    flexWrap: "nowrap",
  }),

  input: (base) => ({
    ...base,
  }),
};

export default customStyles;
