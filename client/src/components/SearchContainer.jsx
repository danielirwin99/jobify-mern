import Wrapper from "../assets/wrappers/SearchContainer";
import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";

const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
    console.log(search)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters();
  };

  return (
    <Wrapper>
      <form className="form">
        <h4>Search Form</h4>
        {/* Search Position */}
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          {/* Search by Status */}
          <FormRowSelect
            labelText="Job Status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="Type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={jobTypeOptions}
          />
          {/* Sort */}
          <FormRowSelect
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={sortOptions}
          />
          {/* Clear Filters Button */}
          <button
            className="btn btn-block btn-danger"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            Clear Filters
          </button>
        </div>
      </form>
    </Wrapper>
  );
};

export default SearchContainer;
