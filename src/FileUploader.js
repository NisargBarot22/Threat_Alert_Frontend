import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            padding: "5px 10px"
        },
    },
    input: {
        display: "none",
    },
    center: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "-43px -22px",
        padding: "115px 44px"
    },
}));

function PcapUploader() {
    const classes = useStyles();
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const response = await axios.post(
                "http://localhost:8001/predict",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("response", response)
            setResponse(response.data);
            setPrediction(response.data);
            setSubmitted(true);
            setLoading(false);
            setResult(response.data)
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    return (
        <div className={classes.center}>
            <div className="outer-box">
                <div className="image-preview-area">
                    <img
                        src={require("./image_icon.png")}
                        width="200"
                        alt="Image Icon"
                        className="image-icon"
                    />
                </div>
                <Box boxShadow={3} p={3} className="main-box">
                    <form className={classes.root} onSubmit={handleSubmit}>
                        <input
                            accept=".pcap, .pcapng"
                            className={classes.input}
                            id="contained-button-file"
                            type="file"
                            onChange={handleFileChange}
                        />
                        <label htmlFor="contained-button-file">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<CloudUploadIcon />}
                                component="span"
                            >
                                Upload .pcap
                            </Button>
                        </label>
                        <TextField
                            id="outlined-read-only-input"
                            label="Selected file"
                            defaultValue="No file selected"
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            value={file ? file.name : "No file selected"}
                        />
                        <Button variant="contained" color="primary" type="submit">
                            Analyze
                        </Button>
                    </form>
                    {submitted ? (
                        <div className="result-area">
                            <h1 className="result-text">Total Entries - {result?.predictions?.length}</h1>
                            <h1 className="result-text">Benign Entries - {result?.predictions?.filter(entry => entry === "Benign").length}</h1>
                            <h1 className="result-text">Dos Entries - {result?.predictions?.filter(entry => entry === "Dos").length}</h1>
                            <h1 className="result-text">BruteForce Entries - {result?.predictions?.filter(entry => entry === "BruteForce").length}</h1>
                            <h1 className="result-text">DDos Entries - {result?.predictions?.filter(entry => entry === "DDos").length}</h1>
                            <h1 className="result-text">Infilteration Entries - {result?.predictions?.filter(entry => entry === "Infilteration").length}</h1>
                         
                        </div>
                    ) : (
                        <>
                            {loading ? <h3>Analyzing...</h3> : null}
                        </>
                    )}
                </Box>
            </div>
        </div>
    );
}

export default PcapUploader;
