import AddIcon from "@mui/icons-material/Add";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";
import { addToBagMutation, patchtoBagMutation } from "../hooks/addToBag";
import GetGoods from "../hooks/getGoods";

const ProductCard = ({ good }) => {
  const [liked, setLiked] = useState(false);
  const { bagGoods } = GetGoods();
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const clickTimeout = useRef(null);

  const { addToBag } = addToBagMutation();
  const { patchtoBag } = patchtoBagMutation();

  const { mutate: updateStatus } = useMutation(
    async (newStatus) =>
      await axios.patch(`http://localhost:3001/goods/${good.id}`, {
        status: newStatus,
      })
  );

  useEffect(() => {
    const likedGoods = JSON.parse(localStorage.getItem("likedGoods")) || [];
    if (likedGoods.some((item) => item.id === good.id)) {
      setLiked(true);
    }
  }, [good.id]);

  const handleLike = async (e) => {
    e.preventDefault();
    const newLiked = !liked;
    setLiked(newLiked);
    updateStatus(newLiked);
    let likedGoods = JSON.parse(localStorage.getItem("likedGoods")) || [];
    if (newLiked) {
      likedGoods.push(good);
    } else {
      likedGoods = likedGoods.filter((item) => item.id !== good.id);
    }
    localStorage.setItem("likedGoods", JSON.stringify(likedGoods));
  };

  const handleAddToBag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isProductExist = bagGoods.find((prod) => +prod.prod_id === +good.id);

    if (isProductExist === undefined) {
      addToBag(good && { productId: good.id, media: good.media[0], title: good.title });
    } else {
      isProductExist &&
        patchtoBag(
          good && {
            productId: isProductExist.id,
            productNum: isProductExist.num,
            media: good.media[0],
            title: good.title,
          }
        );
    }
  };

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleClick = (e) => {
    e.preventDefault();
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      handleOpenModal();
    } else {
      clickTimeout.current = setTimeout(() => {
        clickTimeout.current = null;
        handleAddToBag(e);
      }, 300);
    }
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const leftImages = good.media.slice(1); // Assuming `good.media` is an array of image URLs
  const rightImage = good.media[0];
  const myProd = good;

  return (
    <>
      <Link to={`product?id=${good.id}`} style={{ textDecoration: "none" }}>
        <Card
          sx={{
            width: "100%",
            height: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <CardMedia
            component="img"
            alt={good.title}
            height="200px"
            image={good.media[0]}
            title={good.title}
            sx={{
              objectFit: "contain",
              zIndex: 1,
              transition: "transform 0.3s ease-in-out", // Add transition for smooth effect
              "&:hover": {
                transform: "scale(1.1)", // Scale image on hover
              },
            }}
          />
          <IconButton
            size="small"
            aria-label="like"
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 2,
            }}
            onClick={handleLike}
          >
            <FavoriteBorderOutlinedIcon sx={{ backgroundColor: liked ? "red" : "transparent" }} fontSize="small" />
          </IconButton>
          <CardContent sx={{ flex: "1 0 auto", paddingBottom: 0 }}>
            <Typography color={"#3B3C36"} variant="subtitle1" component="h6" noWrap>
              {good.title}
            </Typography>
            <Typography mt={2} marginBottom={"5%"} variant="caption" color="" component="mark">
              {Math.floor((good.price * 12) / 100)} So'm/oyiga
            </Typography>
            <Box mt={4} marginBottom={"10%"} display="flex" justifyContent="space-between" alignItems="center">
              <Box display="flex" flexDirection="column" alignItems="flex-start">
                <Typography variant="body2" color="textSecondary" component="del">
                  {good.price - Math.floor((good.price * good.salePercentage) / 100)} So'm
                </Typography>
                <Typography sx={{ fontSize: "16px" }} variant="body2" component="span">
                  {good.price} So'm
                </Typography>
              </Box>
              <IconButton size="small" aria-label="add to bag" onClick={handleClick}>
                <AddOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Link>
      <Modal
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="product-detail-modal-title"
        aria-describedby="product-detail-modal-description"
      >
        <Box
          sx={{
            position: "relative",
            width: "60%", // Adjusted width to 50%
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "calc(100vh - 3%)", // Adjusted to leave 3% from the top
            overflowY: "auto", // Set overflowY to "hidden"
            borderRadius: "15px",
            margin: "3% auto 0", // Added margin from top, removed auto margins from sides
            border: "1px solid gray", // Added border
          }}
          ref={(el) => {
            if (el) {
              el.scrollTop = 0;
            }
          }}
        >
          <Grid container spacing={2} pl={3} pt={3}>
            <Grid item xs={12}>
              <Stack spacing={2}></Stack>
            </Grid>
            <Grid item xs={12}>
              <Stack direction="row" spacing={2}>
                <Box
                  component="img"
                  src={rightImage}
                  alt={myProd && myProd.title}
                  sx={{ width: "300px", height: "400px", boxShadow: 3 }}
                />
                <Container sx={{ width: "50%" }}>
                  <Stack spacing={2} pl={3}>
                    <Typography variant="h5">{myProd.title}</Typography>

                    <hr />
                    <Typography variant="p">O'lcham:</Typography>
                    <Stack direction="row" spacing={1}>
                      {/* Outlined small box cards */}

                      <Card variant="outlined" sx={{ width: 60, height: 35 }}>
                        <CardContent
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
                        >
                          <Typography sx={{ display: "flex", gap: "6px" }} variant="body1">
                            22
                            <span>sm</span>
                          </Typography>
                        </CardContent>
                      </Card>
                      <Card variant="outlined" sx={{ width: 60, height: 35 }}>
                        <CardContent
                          sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}
                        >
                          <Typography sx={{ display: "flex", gap: "6px" }} variant="body1">
                            29
                            <span>sm</span>
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                    <Typography variant="p">Miqdor:</Typography>
                    <Box sx={{ display: "flex", gap: "20px", alignItems: "center" }}>
                      <TextField
                        value={quantity}
                        inputProps={{ min: 1, style: { textAlign: "center" } }}
                        size="small"
                        variant="outlined"
                        readOnly
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton onClick={handleDecrement} size="small">
                                <RemoveIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={handleIncrement} size="small">
                                <AddIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{ width: "130px" }}
                      />
                      <Typography sx={{ fontSize: "14px", color: "green" }} variant="p">
                        Sotuvda 225 ta bor
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: "30px", alignItems: "center" }}>
                      <Typography sx={{ whiteSpace: "nowrap" }} variant="h6">
                        {myProd.price} so'm
                      </Typography>
                      <del style={{ display: "flex", gap: "6px", whiteSpace: "nowrap" }}>
                        200 <span> 000 so'm</span>
                      </del>

                      <Card
                        sx={{
                          width: "30%",
                          height: "30px",
                          bgcolor: "Yellow",
                          mr: 2,
                          textAlign: "center",
                          paddingTop: "1px",
                          alignItems: "center",
                          fontSize: "15px",
                        }}
                      >
                        yozgi savdo
                      </Card>
                    </Box>
                    <Button
                      sx={{
                        width: "100%",
                        height: "7vh",
                        bgcolor: "#F5F5F5",
                        color: "black",
                        textTransform: "lowercase",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        "&:hover": {
                          bgcolor: "#E5E4E2",
                        },
                      }}
                    >
                      <Card
                        sx={{
                          width: "30%",
                          height: "30px",
                          bgcolor: "Yellow",
                          mr: 2,
                          textAlign: "center",
                          paddingTop: "1px",
                        }}
                      >
                        Oyiga 5 270 so'mdan
                      </Card>
                      muddatli to'lov
                    </Button>
                    <Stack direction="row" spacing={1}>
                      <Button
                        sx={{ width: "100%", bgcolor: "#8A2BE2", borderRadius: "10px", height: "6vh" }}
                        variant="contained"
                      >
                        Savatga qo'shish
                      </Button>
                    </Stack>
                    <Stack>
                      <Box
                        sx={{
                          width: "100%",
                          height: "32vh",
                          border: "1px solid gray",
                          borderRadius: "20px",
                          padding: 2,
                        }}
                      >
                        <Typography sx={{ fontSize: "16px" }} variant="h6">
                          1 kundan boshlab texkor yetkazma
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }} variant="body2">
                          Uzum buyurtmalarni topshirish punktida yoki kuryer orqali
                        </Typography>
                        <hr />
                        <Typography sx={{ fontSize: "18px" }} variant="h6">
                          Qulay usulda xavfsiz toʻlov
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }} variant="body2">
                          Karta orqali, naqd pulda yoki boʻlib toʻlang
                        </Typography>
                        <Box display="flex" alignItems="center" textAlign="center"></Box>
                        <hr />
                        <Typography sx={{ fontSize: "18px" }} variant="h6">
                          Qaytarish oson va tez
                        </Typography>
                        <Typography sx={{ fontSize: "12px" }} variant="body2">
                          Tovarlarni 10 kun ichida qabul qilamiz va darhol pulini qaytaramiz
                        </Typography>
                      </Box>
                    </Stack>
                  </Stack>
                </Container>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default ProductCard;
