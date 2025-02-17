# Connecting to Scryfall

```javascript
only for using scryfall api
localForage.config({
  driver: localForage.INDEXEDDB, // Use IndexedDB
  name: 'scryfallOracleCardsCache' // Distinct name for oracle cards
});
```

```javascript
only for using Scryfall API
  useEffect(() => {
    const loadCardData = async () => {
      setLoading(true);
      try {
        const storedCardData = await localForage.getItem('scryfallOracleCardData');
        const storedCardNames = await localForage.getItem('scryfallOracleCardNames');

        if (storedCardData && storedCardNames) {
          setCardData(storedCardData);
          setCardNameOptions(storedCardNames);
          console.log("Loaded oracle card data from IndexedDB");
        } else {
          const response = await axios.get('https://api.scryfall.com/bulk-data/oracle-cards');
          const bulkDataUrl = response.data.download_uri; // Correct path for oracle-cards

          const cardDataResponse = await axios.get(bulkDataUrl);
          const allCards = cardDataResponse.data;

          const cardDataByName = {};
          const nameOptions = new Set();
          allCards.forEach(card => {
            cardDataByName[card.name] = card;
            nameOptions.add(card.name);
          });

          await localForage.setItem('scryfallOracleCardData', cardDataByName);
          await localForage.setItem('scryfallOracleCardNames', Array.from(nameOptions));
          console.log("Fetched and stored oracle card data in IndexedDB");

          setCardData(cardDataByName);
          setCardNameOptions(Array.from(nameOptions));
        }
      } catch (error) {
        console.error("Error fetching or loading oracle card data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, []);
```
