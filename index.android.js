/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Image,
  ListView,
  View,
  ToolbarAndroid
} from 'react-native';

export default class flickrClient extends Component {
  constructor(props) {	 
    super(props);
	var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
	  isLoading: false,
	  items: [],
	  dataSource: ds.cloneWithRows(['.']),
	  page: 0
    };
	
  }
  handleResponse(response) {
	var newItems = [];
	for (var i = 0; i < response.length; i++) {
		newItems.push(this.createPhotoUrl(response[i].farm, response[i].server, response[i].id, response[i].secret, 'n'));
    }
	this.setState({ items: this.state.items.concat(newItems)});	
	this.setState({ dataSource: this.state.dataSource.cloneWithRows(this.state.items)});
	this.setState({ isLoading: false});
  }
  createPhotoUrl(farm, server, photoId, secret, size) {
	  return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + photoId + '_' + secret + '_' + size + '.jpg';
  }
  loadMore() {
	if (this.state.isLoading == false) {		
	var newPage = this.state.page + 1;
	var url = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=0edf869941f0aff59f741ddcdfcc3374&per_page=10&page=' + newPage + '&format=json&nojsoncallback=1'
	fetch(url)
      .then((response) => response.json())
      .then((responseJson) => responseJson.photos)
      .then((photos) => {
		this.setState({ isLoading: true});
		this.setState({ page: newPage});
        return this.handleResponse(photos.photo);
      })
      .catch((error) => {
        console.error(error);
      });
	}
  }
  render() {
    return (
		<View>
			<ToolbarAndroid style={styles.toolbar} title="Flickr Client" titleColor="#FFF" />		
			<ListView
			  onEndReached={this.loadMore()}			  
			  dataSource={this.state.dataSource}
			  renderRow={(rowData) =>
			  <View style={{paddingTop: 5, paddingRight: 5, paddingLeft: 5, flex: 1, flexDirection: 'column'}}>			
				<Image source={{uri: rowData}} style={{height: 200}}/>				
			  </View>	
			  }
			/>			
		</View>
		
    );
  }
}

const styles = StyleSheet.create({
  toolbar: {
   backgroundColor: '#512DA8',   
   height: 56,
   alignSelf: 'stretch',
   elevation: 10   
 }
});

AppRegistry.registerComponent('flickrClient', () => flickrClient);
