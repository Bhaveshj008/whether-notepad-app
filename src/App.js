import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [notes, setNotes] = useState(["Sample note 1", "Sample note 2"]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      const API_KEY = '5d4abaf2410c48deb73453548faa832a';  
      const CITY = 'malegaon';
      const URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${CITY}&key=${API_KEY}&days=7&units=M`;

      try {
        const response = await axios.get(URL);
        const data = response.data;

        setWeatherData({
          avgTemp: data.data.reduce((acc, day) => acc + day.temp, 0) / data.data.length,
          avgRainfall: data.data.reduce((acc, day) => acc + (day.precip || 0), 0) / data.data.length,
          avgHumidity: data.data.reduce((acc, day) => acc + day.rh, 0) / data.data.length,
          currentTemp: data.data[0].temp,
          weeklyTemp: data.data.map((day, index) => ({
            day: `Day ${index + 1}`,
            temp: day.temp
          }))
        });
      } catch (error) {
        console.error('Error fetching weather data', error);
      }
    };

    fetchWeatherData();
  }, []);

  const handleDeleteNote = (index) => {
    setNotes(notes.filter((_, i) => i !== index));
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      if (newNote.length > 200) {
        alert("Note cannot exceed 200 characters.");
      } else {
        setNotes([...notes, newNote.trim()]);
        setNewNote('');
      }
    } else {
      alert("Note cannot be empty.");
    }
  };

  if (!weatherData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="md" className="container">
      <Typography variant="h4" component="div" gutterBottom className="header">
        Weather and Notepad Application
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card className="card animated fadeInLeft">
            <CardContent>
              <Typography variant="h6">Avg Temp of Week</Typography>
              <Typography variant="h4">{weatherData.avgTemp.toFixed(2)}°C</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className="card animated fadeInDown">
            <CardContent>
              <Typography variant="h6">Avg Rainfall of Week</Typography>
              <Typography variant="h4">{weatherData.avgRainfall.toFixed(2)} mm</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className="card animated fadeInRight">
            <CardContent>
              <Typography variant="h6">Avg Humidity of Week</Typography>
              <Typography variant="h4">{weatherData.avgHumidity.toFixed(2)}%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className="card animated fadeInUp">
            <CardContent>
              <Typography variant="h6">Current Temp</Typography>
              <Typography variant="h4">{weatherData.currentTemp.toFixed(2)}°C</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" component="div" gutterBottom className="section-header animated fadeIn">
        Avg Temperature of Previous Week
      </Typography>
      <ResponsiveContainer width="100%" height={300} className="chart-container animated fadeIn">
        <BarChart data={weatherData.weeklyTemp} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="temp" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="h5" component="div" gutterBottom className="section-header animated fadeIn">
        Notepad
      </Typography>
      <TextField
        label="New Note"
        variant="outlined"
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        fullWidth
        className="note-input animated fadeIn"
      />
      <Button variant="contained" color="primary" onClick={handleAddNote} fullWidth className="button animated fadeIn">
        Add Note
      </Button>
      <List>
        {notes.map((note, index) => (
          <ListItem key={index} className="note-item animated fadeIn">
            <ListItemText primary={note} />
            <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNote(index)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default App;
