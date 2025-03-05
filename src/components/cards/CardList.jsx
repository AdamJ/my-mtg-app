import React, { useState } from 'react';
import { Avatar, Card, CardContent, Grid2, IconButton, List, ListItem, ListSubheader, ListItemAvatar, ListItemText, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const CardList = () => {
  const [cardCounts, setCardCounts] = useState({});

  // eslint-disable-next-line no-unused-vars
  const [cardList, setCardList] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [groupingOption, setGroupingOption] = useState('type');
  const groupCards = (cards, option) => {
    const groupedCards = {};
    cards.forEach(card => {
      let groupKey;
      switch (option) {
        case 'color':
          groupKey = card.color;
          break;
        case 'type':
          groupKey = card.type;
          break;
        default:
          groupKey = 'Ungrouped';
      }

      if (!groupedCards[groupKey]) {
        groupedCards[groupKey] = [];
      }
      groupedCards[groupKey].push(card);
    });
    return groupedCards;
  };

  const handleUpdateCardNumber = (card, value) => {
    setCardCounts(prevCounts => ({
      ...prevCounts,
      [card.name]: value
    }));
  };

  const handleDeleteCard = (card) => {
    // Implement your delete logic here
    console.log('Delete card:', card);
  };

  // eslint-disable-next-line no-unused-vars
  const renderColorIdentityIcons = (colorIdentity) => { return null; };

  const groupedCardList = groupCards(cardList, groupingOption);
  return (
    <Card>
      <CardContent>
        <Grid2 item xs={12}>
          <List>
            {Object.keys(groupedCardList).map(groupKey => (
              <List key={groupKey} subheader={
                <ListSubheader component="div" id={groupKey}>{groupKey}</ListSubheader>
              }>
                {groupedCardList[groupKey].map((card) => (
                  <ListItem key={card.name}
                    secondaryAction={[
                      <TextField
                        key="1"
                        type="number"
                        size="small"
                        value={cardCounts[card.name] || 1}
                        onChange={e => handleUpdateCardNumber(card, e.target.value)}
                        sx={{ width: '60px', margin: '0 8px' }}
                      />,
                      <IconButton key="2" edge="end" color="error" onClick={() => handleDeleteCard(card)}>
                        <DeleteIcon />
                      </IconButton>
                    ]}>
                    <ListItemAvatar>
                      <Avatar sx={{ width: 50, height: 50 }}>
                        <img
                          src={card.scryfallData?.image_uris?.normal || 'placeholder_url'}
                          alt={card.name}
                          style={{ objectFit: 'contain', width: '60px' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={card.name}
                      secondary={[
                        <span key="1">
                        <Typography component="span" variant="caption">
                          {card.type}
                        </Typography>
                        </span>,
                        <span key="2">
                        <Typography component="span" variant="caption" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px', textTransform: 'capitalize' }} color="text.secondary">
                          {card.scryfallData?.rarity}
                        </Typography>
                        </span>,
                        card.scryfallData?.color_identity && (
                          <span key="3">{renderColorIdentityIcons(card.scryfallData?.color_identity)}</span>
                        ),
                        card.scryfallData?.produced_mana && (
                          <span key="4">
                          <Typography component="span" variant="caption" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '2px' }} color="text.secondary">
                            Produces: {renderColorIdentityIcons(card.scryfallData?.produced_mana)}
                          </Typography>
                          </span>
                        ),
                      ]}
                    />
                  </ListItem>
                ))}
              </List>
            ))}
          </List>
        </Grid2>
      </CardContent>
    </Card>
  )
};

export default CardList;
