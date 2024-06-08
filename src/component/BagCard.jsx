import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { Avatar, Box, Checkbox, Container, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import GetGoods from "../hooks/getGoods";
import { useDeleteData, useEditData } from "../modules/context/https";

const BagCard = ({ goods, index, updateQuantity }) => {
  const { bagGoods } = GetGoods();
  const [showElement, setShowElement] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const deleteDataMutation = useDeleteData();
  const editDataMutation = useEditData();

  const res = useMemo(() => bagGoods.find((prod) => goods.id === prod.prod_id), [bagGoods, goods.id]);

  const handleDelete = async () => {
    try {
      await deleteDataMutation.mutateAsync(`/bag/${res.id}`);
      setShowElement(false);
    } catch (error) {
      console.error("error", error);
    }
  };

  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(goods.id, newQuantity);
  };

  const decrementQuantity = () => {
    const newQuantity = quantity > 1 ? quantity - 1 : 1;
    setQuantity(newQuantity);
    updateQuantity(goods.id, newQuantity);
  };

  return (
    <Container sx={{ display: "flex", flexDirection: "column" }}>
      {showElement && (
        <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: "100%" }}>
          {index !== 0 && <hr style={{ width: "100%", backgroundColor: "lightgray" }} />}
          <Box display="flex" alignItems="center" sx={{ width: "100%", gap: "20px", padding: "1px" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Checkbox />
            </Box>
            <Avatar
              sx={{
                width: "70px",
                height: "16vh",
                borderRadius: "10px",
                boxShadow: "10px",
              }}
              src={goods.media[0]}
              alt=""
            />
            <Box display="flex" flexDirection="column" sx={{ flexGrow: 1, gap: "10px" }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: "15px", color: "black" }} variant="body2">
                  {goods.title.slice(0, 40)}
                </Typography>
                <Box display="flex" alignItems="center">
                  <IconButton onClick={handleDelete} aria-label="delete">
                    <DeleteIcon fontSize="big" />
                  </IconButton>
                  <Typography sx={{ fontSize: "15px", color: "gray" }}>yo'q qilish</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
                <Typography sx={{ fontSize: "15px", color: "gray", display: "flex", gap: "10px" }} variant="body2">
                  Sotuvchi: <span style={{ color: "black" }}>Progress</span>
                </Typography>
                <Box display="flex" alignItems="center" sx={{ gap: "50px" }}>
                  <TextField
                    value={quantity}
                    inputProps={{ min: 1, style: { textAlign: "center" } }}
                    size="small"
                    variant="outlined"
                    readOnly
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <IconButton onClick={decrementQuantity} size="small">
                            <RemoveIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={incrementQuantity} size="small">
                            <AddIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ width: "160px" }}
                  />
                  <Typography sx={{ fontSize: "20px", color: "black" }} variant="body2">
                    26 000 so'm
                  </Typography>
                </Box>
              </Box>
              <Typography sx={{ textAlign: "end", color: "gray" }}>
                <del>86 000 so'm</del>
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default BagCard;
