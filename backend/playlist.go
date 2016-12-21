package main

import (
	"encoding/json"
	"errors"
	"strings"
)

type Playlist struct {
	SongList      []*Song `json:"items"`
	ActiveSong    *Song   `json:"activeItem"`
	IsPaused      bool    `json:"isPaused"`
	CurrentTime   int     `json:"currentTime"`
	Duration      int     `json:"duration"`
	RepeatingMode string  `json:"repeatingMode"` // ENUM("all", "one", "none")
	IsShuffleOn   bool    `json:"isShuffleOn"`
}

func newPlaylist() *Playlist {
	return &Playlist{
		SongList:      make([]*Song, 0),
		ActiveSong:    nil,
		IsPaused:      false,
		CurrentTime:   0,
		Duration:      0,
		RepeatingMode: "none",
		IsShuffleOn:   false,
	}
}

func (p *Playlist) add(body []byte) error {
	song := newSong()
	if err := json.Unmarshal(body, song); err != nil {
		return err
	}

	if !song.validate() {
		return errors.New("invalid data")
	}

	p.SongList = append(p.SongList, song)
	return nil
}

func (p *Playlist) delete(body []byte) error {
	song := newSong()
	if err := json.Unmarshal(body, song); err != nil {
		return err
	}

	if song.UUID == "" {
		return errors.New("invalid data")
	}

	songList := make([]*Song, 0)
	for _, innerSong := range p.SongList {
		if strings.Compare(innerSong.UUID, song.UUID) != 0 {
			songList = append(songList, innerSong)
		}
	}
	p.SongList = songList

	if strings.Compare(song.UUID, p.ActiveSong.UUID) == 0 {
		p.ActiveSong = nil
	}

	return nil
}

func (p *Playlist) activate(body []byte) error {
	song := newSong()
	if err := json.Unmarshal(body, song); err != nil {
		return err
	}

	if song.UUID == "" {
		return errors.New("invalid data")
	}

	for _, innerSong := range p.SongList {
		if strings.Compare(innerSong.UUID, song.UUID) == 0 {
			p.ActiveSong = innerSong
			break
		}
	}

	return nil
}

func (p *Playlist) play() error {
	if p.ActiveSong == nil {
		return errors.New("invalid data")
	}

	p.IsPaused = false
	return nil
}

func (p *Playlist) pause() error {
	if p.ActiveSong == nil {
		return errors.New("invalid data")
	}

	p.IsPaused = true
	return nil
}

func (p *Playlist) update(rawBody []byte) error {
	body := make(map[string]interface{})
	if err := json.Unmarshal(rawBody, &body); err != nil {
		return err
	}

	if currentTime, ok := body["currentTime"].(float64); ok {
		p.CurrentTime = int(currentTime)
	}

	if duration, ok := body["duration"].(float64); ok {
		p.Duration = int(duration)
	}

	if repeatingMode, ok := body["repeatingMode"].(string); ok {
		p.RepeatingMode = repeatingMode
	}

	if isShuffleOn, ok := body["isShuffleOn"].(bool); ok {
		p.IsShuffleOn = isShuffleOn
	}

	return nil
}