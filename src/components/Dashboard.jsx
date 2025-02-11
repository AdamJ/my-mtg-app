// src/pages/About.jsx  (or src/About.jsx)
import React from 'react';
import PageTemplate from './PageTemplate'; // Adjust path if needed

function About() {
  return (
    <PageTemplate title="Dashboard"> {/* Set the title */}
      {/* Add your content here */}
      <p>Welcome!</p>
      <ul>
        <li>CubeCobra</li>
        <li>Scryfall</li>
      </ul>
      {/* More components, text, etc. */}
    </PageTemplate>
  );
}

export default About;
