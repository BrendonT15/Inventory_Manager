'use client' // makes this a client sided app
import Image from "next/image";
import { useState, useEffect } from "react";
import {firestore} from "@/firebase";
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [filter, setFilter] = useState('')
  
  const updateInventory = async () => {
    // async means that is won't block our code when it's fetching, doing this in the background while letting other lines of code run, website will free if not async
    const snapshot = query(collection(firestore, "inventory"))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>(
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
        
      })
    ))
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else {
      await setDoc(docRef, {quantity: 1})
    }
    await updateInventory()
  }


  const removeItem = async (item) =>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }
    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    // THE ENTIRE SCREEN 

    <Box 
    sx={{
      width:"100vw",
      height:"100vh",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      gap:2,
      backgroundColor:"rgba(0,0,0,0.9)",
    }}>

      {/* SEARCH BAR */}

      <TextField 
      variant="outlined" 
      sx={{
        width:"800px",
        "& .MuiInputBase-input": {
          color: "#AAA",
        },
        "& .MuiInputBase-input::placeholder": {
          color: "#AAA",
        },
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "transparent", 
          },
        },
        border:"1px solid #666",
        borderRadius:"12px",
      }} 
      placeholder="Search Item" 
      onChange={(e)=>{setFilter(e.target.value)}}
      />

      {/* ADD ITEM MODAL */}

      <Modal open={open} onClose={handleClose}>
        <Box position="absolute" 
        top="50%" 
        left="50%" 
        width={400} 
        bgcolor="white" 
        border="2px solid #000" 
        boxShadow={24} 
        p={4} 
        display="flex" 
        flexDirection="column" 
        gap={3}
        sx={{ // APPLIED STYLES DIRECTLY RATHER THAN PRE-BUILT PROPS
          transform:"translate(-50%,-50%)",
          borderRadius:"12px",
        }}>
          <Typography variant="h6">
            Add Item
          </Typography>
          <Stack 
          width="100%" 
          direction="row" 
          spacing={2}>
            <TextField variant='outlined'
            fullWidth
            value={itemName}
            onChange={(e)=>{
              setItemName(e.target.value)
            }}
            />
            <Button 
              variant="outlined" 
              onClick={()=>{
                addItem(itemName)
                setItemName('')
                handleClose()
            }}>ADD
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* INVENTORY ITSELF */}

      <Box border="1px solid #333" borderRadius="12px">
        <Box 
        width="800px" 
        height="100px" 
        display="flex" 
        flexDirection="column"
        alignItems="center" 
        justifyContent="center">
          <Typography 
          variant="h2" 
          color="#AAA">
            Inventory Items
          </Typography>
            <hr style={{
            border:"0",
            borderTop:"1px solid #AAA",
            width:"35%",
            height:"1px",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            marginTop:"8px",
            }}/>
        </Box>
        <Stack 
        width="800px" 
        height="300px" 
        spacing={2} 
        overflow="auto">
        {
          inventory.filter(item => item.name.toLowerCase().includes(filter.toLowerCase())).map(({name, quantity})=>(
            <Box key={name} width="100%" minheight="150px" display="flex" alignItems="center" justifyContent="space-between" bgColor="#f0f0f0" padding={5}>
              <Typography variant="h3" color="#AAA" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#AAA" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={()=>{
                  addItem(name)
                }}>Add
                </Button>
                <Button variant="contained" onClick={()=>{
                  removeItem(name)
                }}>Remove
                </Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>

      {/* ADD NEW ITEM BUTTON */}
      <Button variant = "contained" onClick={() =>{
        handleOpen()
      }}>Add New Item</Button>
    </Box>
  )
}
