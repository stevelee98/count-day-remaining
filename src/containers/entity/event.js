import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class Event {
    constructor(id, title, note, dayEvent, resource) {
        this.id = id;
        this.title = title;
        this.note = note;
        this.dayEvent = dayEvent;
        this.resource = resource;
    }
}
