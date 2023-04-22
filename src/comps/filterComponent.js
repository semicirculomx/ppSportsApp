
import React from 'react';
import { Form } from 'react-bootstrap';

const FilterComponent = ({ onFilterChange }) => {
  const handleFilterChange = (event) => {
    onFilterChange(event.target.value);
  };

  return (
    <Form.Group className="input-container" controlId="filterSelect">
      <Form.Control className="input-field" as="select" onChange={handleFilterChange}>
      <option value="all">All</option>
        <option value="recent">Most Recent</option>
        <option value="most-liked">Most Liked</option>
        <option value="lost">Lost</option>
        <option value="won">Won</option>
        <option value="upcoming">Upcoming</option>
      </Form.Control>
    </Form.Group>

  );
};

export default FilterComponent;

// import React from 'react';
// import { Form } from 'react-bootstrap';

// const FilterComponent = ({ filters, onChange }) => {
//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     onChange(name, value);
//   };

//   return (
//     <div className="filter-bar">
//       {filters.map((filter) => (
//         <Form.Group controlId="filterSelect" key={filter.name} className="filter">
//           <Form.Label >{filter.label}</Form.Label>
//           <Form.Control as="select" name={filter.name} onChange={handleChange}>
//             {filter.options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </Form.Control>
//         </Form.Group>
//       ))}
//     </div>
//   );
// };

// export default FilterComponent;