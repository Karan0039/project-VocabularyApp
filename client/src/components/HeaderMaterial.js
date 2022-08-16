import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import { MdClose } from "react-icons/md";
import { styled } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import "@fontsource/kumbh-sans";
import Container from '@mui/material/Container';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
// import fs from 'fs'
// import englishWords from 'an-array-of-english-words'




const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: "#720D5D",
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(2)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '145ch',
            '&:focus': {
                width: '145ch',
            },
        },
    },
}));

export default function SearchAppBar() {
    const [showIcon, setShowIcon] = useState(false)
    const [value, setValue] = useState("")
    const [word, setWord] = useState("")
    // const [audio, setAudio] = useState(false)
    let parsedValue, etymologies, senses, prevCategory
    let output = 0

    const handleWord = (event) => {
        setWord(event.target.value) 
    }

    const getData = async (word) => {
        let data = await fetch("/" + word.trim())
        data = data.json()
        return data
    }
    const handleEnter = (e) => {
        if (e.key === "Enter") {
            getData(word).then(res => {
                setValue(JSON.stringify(res))
            })
        }
    }
    const handleSearch = () => {
        getData(word).then(res => {
            setValue(JSON.stringify(res))
        })

    }

    const toggelIcons = () => {
        setShowIcon(!showIcon)
    }

    if (value.length > 0) {
        output = 1
        parsedValue = JSON.parse(value)
        if (parsedValue["error"]) output = 2
        else {
            parsedValue = parsedValue["result"]
            etymologies = parsedValue["etymologies"]
            senses = parsedValue["senses"]
            prevCategory = senses[0]["category"]
        }
    }


    return (
        <>
            <div style={{ backgroundColor: "#4E0D3A" }}>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static" style={{ backgroundColor: "#4E0D3A" }}>
                        <Toolbar>
                            {!showIcon ?
                                <>
                                    <Typography
                                        variant="h4"
                                        noWrap
                                        component="div"
                                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, cursor: "pointer" }}
                                        onClick={() => window.location.reload()}>
                                        <h1>Lexsikon</h1>
                                    </Typography>
                                    <SearchIcon onClick={toggelIcons} style={{ cursor: "pointer", padding: "10px", height: "50px", width: "50px" }} />
                                </>
                                :
                                <>
                                    <Autocomplete id="custom-input-demo"
                                        options={options}
                                        renderInput={(params) => (
                                            <Search ref={params.InputProps.ref}
                                                style={{ display: "flex", justifyContent: "space-between" }}>
                                                <StyledInputBase {...params.inputProps}
                                                    placeholder="search"
                                                    inputProps={{ 'aria-label': 'search' }}
                                                    value={word}
                                                    style={{ color: "white" }}
                                                    onChange={handleWord} onKeyDown={handleEnter}
                                                />
                                                <Button variant="contained" onClick={handleSearch} style={{ backgroundColor: "#E30425" }}>search</Button>
                                            </Search>)}
                                    />
                                    <MdClose style={{ color: "#E0B0FF", cursor: "pointer", padding: "5px", height: "60px", width: "60px" }}
                                        onClick={toggelIcons}
                                    />
                                </>
                            }
                        </Toolbar>
                    </AppBar>
                </Box>
            </div>
            {output === 1 ?
                <div className="container my-5" style={{ fontFamily: "Kumbh Sans" }}>
                    {/* <audio controls>
                        <source src={parsedValue["pronunciations"]} />
                    </audio> */}
                    {/* <br />
                    <br /> */}
                    <div>
                        <h1>{parsedValue["word"]}</h1>
                        <br />
                        <div style={{ color: "#888888" }}><em>
                            <p>{prevCategory}</p>
                            <p>{" " + etymologies}</p>
                        </em></div>
                        <div>
                            {senses.map(x => {
                                if (x["category"] === prevCategory) {
                                    return (
                                        <>
                                            <p>{" " + x["definitions"]}</p>
                                            <ul>

                                                {x["examples"].map(y => {
                                                    return (
                                                        <>
                                                            <li>
                                                                {y}
                                                            </li>
                                                        </>
                                                    )
                                                })}
                                                <hr />
                                            </ul>
                                        </>
                                    )
                                } else {
                                    prevCategory = x["category"]
                                    return (
                                        <>
                                            <p style={{ color: "#888888" }}><em>{prevCategory}</em></p>
                                            <p>{" " + x["definitions"]}</p>
                                            <ul>
                                                {x["examples"].map(y => {
                                                    return (
                                                        <>
                                                            <li>
                                                                {y}
                                                            </li>
                                                        </>
                                                    )
                                                })}
                                                <hr />

                                            </ul>
                                        </>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
                // Look up a word, learn it forever
                :
                output === 0 ?
                    <div style={{ fontFamily: "Kumbh Sans", color: "#4E0D3A" }}>
                        <Container fixed>
                            <Box sx={{ bgcolor: '#eabfff', height: '100vh' }}>
                                <h2 style={{ textAlign: "center", paddingTop: "20%", width: "100%" }}>Look up a word, learn it forever</h2>
                                <Autocomplete
                                    sx={{
                                        display: 'inline-block',
                                        '& input': {
                                            width: 460,
                                            bgcolor: '#720D5D',
                                            color: "white",
                                            borderRadius: "10px",

                                        }
                                    }}
                                    id="custom-input-demo"
                                    options={options}
                                    renderInput={(params) => (
                                        <div ref={params.InputProps.ref} style={{ marginLeft: "75%", width: 470, display: "flex", justifyContent: "space-between" }}>
                                            <input
                                                type="text"  {...params.inputProps}
                                                value={word}
                                                placeholder="search"
                                                style={{ color: "white", padding: "10px" }}
                                                onChange={handleWord} onKeyDown={handleEnter}
                                            />
                                            <SearchIcon onClick={handleSearch} style={{ cursor: "pointer", padding: "10px", height: "50px", width: "50px" }} />
                                        </div>
                                    )}
                                />
                            </Box>
                        </Container>
                    </div>
                    :
                    <div style={{ fontFamily: "Kumbh Sans", color: "#4E0D3A" }}>
                        <Container fixed>
                            <Box sx={{ bgcolor: '#eabfff', height: '100vh' }}>
                                <h2 style={{ textAlign: "center", paddingTop: "20%", width: "100%" }}>No entry found matching supplied word.</h2>
                            </Box>
                        </Container>
                    </div>
            }
        </>
    );
}

const options = ["qdd","dweed"]
// englishWords