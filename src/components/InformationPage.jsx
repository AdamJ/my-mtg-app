import React, { useState, useEffect } from 'react';
import PageTemplate from './PageTemplate'; // Adjust path if needed
import { Alert, AlertTitle, List, ListItem, ListItemText } from '@mui/material'; // Import Alert and AlertTitle
import packageJson from '../../package.json'; // No require!
function InformationPage() {

  const [latestVersion, setLatestVersion] = useState(null);
  const [previousVersions, setPreviousVersions] = useState([]);

  useEffect(() => {
    try {
      if (packageJson.hasOwnProperty('versionHistory') && packageJson.versionHistory.length > 0) {
        const sortedVersions = [...packageJson.versionHistory].sort((a, b) => {
          const versionA = parseFloat(a.version);
          const versionB = parseFloat(b.version);
          return versionB - versionA;
        });

        setLatestVersion(sortedVersions[0]);
        setPreviousVersions(sortedVersions.slice(1)); // All versions except the first
      } else if (packageJson.hasOwnProperty('versions') && packageJson.versions.length > 0) {
        const sortedVersions = [...packageJson.versions].sort((a, b) => {
           const versionA = parseFloat(a);
           const versionB = parseFloat(b);
           return versionB - versionA; // Descending order (latest first)
        });
        setLatestVersion({version: sortedVersions[0], date: new Date().toLocaleDateString()}); // Get the first element (latest)
        setPreviousVersions(sortedVersions.slice(1).map((version) => ({version: version, date: new Date().toLocaleDateString()})));
      } else {
        setLatestVersion({version: packageJson.version, date: new Date().toLocaleDateString()}); //For when no version history is recorded
      }
    } catch (error) {
      // console.error("Error reading package.json:", error);
      setLatestVersion({version: "Version history not found", date: new Date().toLocaleDateString()});
    }
  }, []);

  return (
    <PageTemplate title="Information"> {/* Set the title */}
      <Alert severity="info">
      <AlertTitle>{latestVersion ? `Latest Version: ${latestVersion.version}` : "Version History"}</AlertTitle>
        {previousVersions.length > 0 && ( // Only show the list if there are previous versions
          <List>
            {previousVersions.map((versionEntry, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Version: ${versionEntry.version}`}
                  secondary={versionEntry.date ? `Date: ${versionEntry.date}` : null}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Alert>
      {/* Add your content here */}
      <h2>What Is This?</h2>
      <p>
        Basically, this is a life counter and deck list `&quot;`app`&quot;` that I use for when I play at Cube events. All of the other counters and/or deck builders that I`&apos;`ve used are great in their own ways, but I wanted to make something for myself that I could customize. If others like it, maybe I`&apos;`ll share it or distribute it through one of the app stores.
      </p>
      <p>
        This app is a project to demonstrate the use of React and Material-UI components to create a simple Magic: The Gathering (MTG) application.
      </p>
      <h2>Resources</h2>
      <ul>
        <li><a href="https://mana.andrewgioia.com/icons.html">Mana and Card icons</a> by <a href="https://andrewgioia.com">Andrew Gioia</a></li>
      </ul>
      <h2>Disclaimer</h2>
      <p>
        Magic: The Gathering is © <a href="https://company.wizards.com/en">Wizards of the Coast</a>. This project is not affiliated nor produced nor endorsed by Wizards of the Coast.
        All card images, mana symbols, expansions and art related to Magic the Gathering is a property of Wizards of the Coast/Hasbro.
        This project may use the trademarks and other intellectual property of Wizards of the Coast LLC as permitted under Wizards`&apos;` Fan Site Policy. MAGIC: THE GATHERING® is a trademark of Wizards of the Coast. For more information about Wizards of the Coast or any of Wizards`&apos;` trademarks or other intellectual property, please visit their website at <a href="https://company.wizards.com/">https://company.wizards.com/</a>.
      </p>
      {/* More components, text, etc. */}
    </PageTemplate>
  );
}

export default InformationPage;
