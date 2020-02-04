import React, {useRef} from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './v1.css';
import './v2.css';


const api = "https://coding-challenge.echoandapex.com/locations?q="
export default function AutoComplete(props){
    const [predictions, setPredictions] = useState([]);
    const [idx, setFocus] = useState(0);
    const [selected, setSelected] = useState(null);
    const refPred = useRef(predictions);
    const refIDX = useRef(idx);

    useEffect(() => {refPred.current = predictions}, [predictions]);
    useEffect(() => {refIDX.current = idx}, [idx]);
    //function to hit api and fetch predictions
    async function fetchPredictions(api) {
        try {
            await axios.get(api)
                .then(res => {
                    let info = res["data"]["predictions"]
                    // let new_info = info.map(data => <li>{data.name}</li>);
                    setPredictions(predictions => info)})
        } catch (err) {
            console.log(err);
        }
    }
    //fetch predictions upon component mounting
    // useEffect(() => {
    //    fetchPredictions(api);
    //    console.log(predictions);
    // }, []);

    async function handleInput(e) {
        e.preventDefault();
        const query = e.target.value;
        let newAPI = api + query;
        await fetchPredictions(newAPI);
    }

    function keyPress(event) {
        //Change highlighted list element on down arrow keystroke
        const key = event.key
        switch(key){
            case "ArrowDown":
                event.preventDefault();
                if(refIDX.current < refPred.current.length - 1) {
                    setFocus(refIDX.current + 1);
                }
                break;
            case "ArrowUp":
                event.preventDefault();
                if(refIDX.current > 0) setFocus(refIDX.current - 1);
                break;
            case "Enter":
                setSelected(refPred.current[refIDX.current]);
                setPredictions([]);
                setFocus(0);
                break;
            case "Backspace":
                setFocus(0);
                break;
            default:
                return;
        }
    }
    
    
    useEffect(() => {
        window.addEventListener('keydown', e => keyPress(e));

        return () => {
            window.removeEventListener('keydown', e => keyPress(e));
        }
    }, []);

    return(

        <div className={"container" + props.tag}>
            <h1 className={"selected" + props.tag}>{selected ? selected.name : ''}</h1>
            <div className={"search-container" + props.tag}>
                <div className={"input-section" + props.tag + (predictions.length > 0 ? ' dropdown' + props.tag : '')}>
                    <i className="fas fa-search"></i>
                    <input type="text" className={"searchbar" + props.tag} placeholder="Enter your query..."  onBlur={() => setPredictions([])} onChange={(e) => handleInput(e)} />
                </div>
                <ul className={"prediction-list" + props.tag}>
                    {predictions.map((prediction, i) => {
                        return (
                            <li className={"list-el" + props.tag + (idx === i ? ' focused' + props.tag : ' unfocused' + props.tag)} key={i}>
                                {prediction.name} ({prediction.description})
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
