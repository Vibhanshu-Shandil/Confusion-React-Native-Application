import React, { Component } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      promotions: state.promotions,
      leaders: state.leaders
    }
  }


function RenderItem(props) {
    
        const item = props.item;
        
        if (item != null) {
            return(
                <Card
                    featuredTitle={item.name}
                    featuredSubtitle={item.designation}
                    image={{uri: baseUrl + item.image}}>
                    <Text
                        style={{margin: 10}}>
                        {item.description}</Text>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

class Home extends Component {

    static navigationOptions = {
        title: 'Home',
    };

    render() {
        if (this.props.dishes.isLoading){
            return(
                <Loading />
            );
        }
        else if (this.props.dishes.errMess){
            return(
                <View> 
                    <Text>{props.erreMess}</Text>
                </View>
            );
        }
        else {
            return(
                <ScrollView>
                    <RenderItem item={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                        isLoading={this.props.dishes.dishes.isLoading}
                        errMess={this.props.dishes.dishes.errMess} />
                    <RenderItem item={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                        isLoading={this.props.promotions.promotions.isLoading}
                        errMess={this.props.promotions.promotions.errMess} />
                    <RenderItem item={this.props.leaders.leaders.filter((leader) => leader.featured)[0]} 
                        isLoading={this.props.leaders.leaders.isLoading}
                        errMess={this.props.leaders.leaders.errMess}/>
                </ScrollView>
            );
        }
    }
}

export default connect(mapStateToProps)(Home);