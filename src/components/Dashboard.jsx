// src/pages/About.jsx  (or src/About.jsx)
import React from 'react';
import Link from '@mui/material/Link';
import PageTemplate from '../components/templates/PageTemplate'; // Adjust path if needed

function About() {
  const apiUrl = import.meta.env.MODE === 'production'
  ? import.meta.env.VITE_API_URL || "https://api.scryfall.com/bulk-data/oracle-cards"
  : import.meta.env.VITE_API_URL || "./src/assets/card_data.json";

  console.log("API URL:", apiUrl);
  const myspace = import.meta.env.MODE;

  return (
    <PageTemplate title="Dashboard"> {/* Set the title */}
      {/* Add your content here */}
      <p>Welcome!</p>
      <p>Below are some resources for Cube building and card lookup. Enjoy!</p>
      <h2>Vite is running in {myspace}</h2>
      <p>Using data from <a href={apiUrl}>{apiUrl}</a></p>
      <ul>
        <li>
          <Link href="https://www.cubecobra.com" target="_blank" rel="noopener">CubeCobra</Link>
        </li>
        <li>
          <Link href="https://www.scryfall.com" target="_blank" rel="noopener">Scryfall</Link>
        </li>
      </ul>
      {/* More components, text, etc. */}
    </PageTemplate>
  );
}

export default About;
