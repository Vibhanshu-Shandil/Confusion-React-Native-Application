import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Input, Rating } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderComments(props) {
    const comments = props.comments;
    const renderCommentItem = ({ item, index }) => {
        return(
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating imageSize={20} style={{flex: 1, flexDirection: 'row'}} readonly startingValue={item.rating} />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return(
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title="Comments">
                <FlatList data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;

    let viewRef;
    const handleViewRef = ref => viewRef = ref;

    const recognizeComment = ({ moveX, moveY, dx, dy}) => {
        if (dx > 200 )
            return true;
        else 
            return false;
    }

    const recognizeDrag = ({ moveX, moveY, dx, dy}) => {
        if (dx < -200 )
            return true;
        else 
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {viewRef.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));},
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if(recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                    {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                    {text: 'OK', onPress: () => {props.favorite ? console.log('Already favorite') : props.onPressFavorite()}},
                    ],
                    { cancelable: false }
                );
            else if(recognizeComment(gestureState))
                    props.onDragRight();

            return true;
        }
    })
    
        if (dish != null) {
            return(
                <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                    ref={handleViewRef}
                    {...panResponder.panHandlers}>
                    <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                            {dish.description}
                        </Text>
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                            <Icon raised reverse name={ props.favorite ? 'heart' : 'heart-o' }
                                type='font-awesome' color='#f50' 
                                onPress={() => props.favorite ? console.log('Already favorite') : props.onPressFavorite()}
                            />
                            <Icon raised reverse name={'pencil'}
                                type='font-awesome' color="#512DA8"
                                onPress={() => props.onPressReview()}
                            />
                        </View>
                    </Card>
                </Animatable.View>
            );
        }
        else {
            return(<View></View>);
        }
}

class DishDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating: 5, 
            author: '',
            comment: '',
            showModal: false
        }
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    resetForm() {
        this.setState({
            rating: 5, 
            author: '',
            comment: '',
            showModal: false
        });
    }

    handleForm(dishId, rating, author, comment) {
        this.props.postComment(
            this.props.navigation.getParam('dishId', ''),
            this.state.rating,
            this.state.author,
            this.state.comment
        );
    }
    
    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPressFavorite={() => this.markFavorite(dishId)} 
                    onPressReview={() => this.toggleModal()}
                    onDragRight={() => this.toggleModal()}
                    />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType = {"slide"} transparent = {false}
                    visible = {this.state.showModal}
                    onDismiss = {() => this.toggleModal() }
                    onRequestClose = {() => this.toggleModal() }>
                    <View style = {styles.modal}>
                        <Rating showRating startingValue="{5}" fractions="{10}" ratingCount={5} onFinishRating={rating => this.setState({ rating: +rating })} />
                        <Input placeholder='Author'
                            leftIcon={ {type: 'font-awesome', name: 'user' } }
                            onChangeText={value => this.setState({ author: value })}
                        />
                        <Input
                            placeholder="Comment"
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            onChangeText={value => this.setState({ comment: value })}
                        />                 
                            <Button 
                                onPress={() =>{this.handleForm(); this.toggleModal(); this.resetForm();}}
                                title="Submit"
                                color="#512DA8"
                            />
                        <Text></Text>
                            <Button 
                                onPress={() =>{this.toggleModal(); this.resetForm();}}
                                title="Close" 
                                color="grey"
                            />
                    </View>
                </Modal>
            </ScrollView>
        );

    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
     }
})

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);