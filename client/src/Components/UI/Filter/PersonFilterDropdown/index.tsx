/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import React, { FC } from "react";

import { Button, Checkbox, Input, Tooltip } from "antd";

import { Person } from "../../../../types/person";

import ProfileImage from "../../Image";

const { Search } = Input;

interface IPersonFilterDropdownProps {
  handlePersonSearch: (searchTerm: string) => void;
  personSearchText: string;
  personList: Person[];
  handlePersonCheckboxChange: (val: string) => void;
  selectedPersonsFilter: string[];
  handlePersonFilterOk: () => void;
  handleReset: () => void;
  isLoading: boolean;
  handleScroll?: (event: React.UIEvent<HTMLElement>) => Promise<void>;
}

const PersonFilterDropdown: FC<IPersonFilterDropdownProps> = ({
  handlePersonSearch,
  personSearchText,
  personList,
  handlePersonCheckboxChange,
  selectedPersonsFilter,
  handlePersonFilterOk,
  handleReset,
  isLoading,
  handleScroll,
}) => {
  return (
    <>
      <div
        className="ant-table-filter-dropdown-search"
        style={{ width: "208px" }}
      >
        <Search
          placeholder="Search in filters"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            handlePersonSearch(e.target.value);
          }}
          value={personSearchText}
        />
      </div>
      <ul
        className="ant-dropdown-menu"
        style={{ maxHeight: "200px" }}
        role="menu"
        tabIndex={0}
        onScroll={handleScroll || undefined}
      >
        {personList?.map((person: Person) => (
          <li
            className="ant-dropdown-menu-item"
            role="menuitem"
            key={person?.id}
            onClick={() => handlePersonCheckboxChange(person?.id)}
          >
            <Checkbox
              onChange={(e) => handlePersonCheckboxChange(person?.id)}
              checked={selectedPersonsFilter?.includes(person?.id)}
            >
              <Tooltip
                overlayClassName="task-tooltip"
                title={`${person?.first_name} ${person?.last_name}`}
              >
                <div
                  onClick={(e) => e.preventDefault()}
                  className="person-list-item person-filter-list-item"
                >
                  <ProfileImage 
                    firstName={person?.first_name}
                    lastName={person?.last_name}
                    profileImage={person?.profile_image}
                    backgroundColor={person?.profile_color_hash}/>
                  <span className="person-name">
                    {person?.first_name} {person?.last_name}
                  </span>
                </div>
              </Tooltip>
            </Checkbox>
          </li>
        ))}
        {isLoading && (
          <li className="ant-dropdown-menu-item" role="menuitem">
            Loading...
          </li>
        )}
      </ul>
      <div className="ant-table-filter-dropdown-btns">
        <Button type="link" size="small" onClick={() => handleReset()}>
          Reset
        </Button>
        <Button type="primary" size="small" onClick={handlePersonFilterOk}>
          OK
        </Button>
      </div>
    </>
  );
};

export default React.memo(PersonFilterDropdown);

PersonFilterDropdown.defaultProps = {
  handleScroll: undefined,
};
