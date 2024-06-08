import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { Box, Button, Checkbox, Container, Grid, Icon, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import BagCard from "../../component/BagCard";
import SearchAppBar from "../../component/Layout/Header";
import ProductCard from "../../component/productCard";
import BagGoods from "../../hooks/getGoods";

const BagPage = () => {
  const [time, setTime] = useState("");
  const { Goods, res, bagLoading, goodsloading, bagError, goodError } = BagGoods();
  const [percentage, setPercentage] = useState(0);

  const handleIncrease = () => {
    setPercentage((prevPercentage) => Math.min(prevPercentage + 10, 100));
  };

  const handleDecrease = () => {
    setPercentage((prevPercentage) => Math.max(prevPercentage - 10, 0));
  };

  const handleInputClick = () => {
    handleIncrease();
  };

  useEffect(() => {
    const currentDate = new Date();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(currentDate.getDate() + 1);
    setTime(tomorrowDate.toDateString());
  }, []);

  const popProds = useMemo(() => (Goods ? Goods.filter((good) => good.type === "PC") : []), [Goods]);

  const updateQuantity = (id, newQuantity) => {
    // Logic to update the quantity of the item in the bag
    console.log(`Update quantity for item ID ${id} to ${newQuantity}`);
  };

  if (bagLoading || goodsloading) {
    return <Typography>Loading...</Typography>;
  }

  if (bagError || goodError) {
    return <Typography>Error loading data</Typography>;
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        px: { xs: 2, sm: 4, md: 6, lg: 8, xl: 10 },
        "@media (min-width:1920px)": {
          maxWidth: "1600px",
        },
      }}
    >
      <SearchAppBar />
      <Box sx={{ display: "flex", gap: "20px", mt: 4 }}>
        <Box
          sx={{
            width: "68%",
            bgcolor: "white",
            border: "1px solid lightgray",
            p: 2,
            mb: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <Checkbox />
            <Typography variant="body1">Hammasini Yechish</Typography>
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
              <Typography variant="body1" sx={{ marginRight: 1, fontSize: "15px", color: "gray" }}>
                Yetkazib berishning eng yaqin sanasi:
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  color: "#8A2BE2",
                  borderColor: "#8A2BE2",
                  "&:hover": {
                    borderColor: "#8A2BE2",
                    backgroundColor: "rgba(138, 43, 226, 0.04)", // Light purple background on hover
                  },
                }}
              >
                M06 8 (Ertaga)
              </Button>
            </Box>
          </Box>
          <hr style={{ width: "100%", backgroundColor: "lightgray" }} />
          {res &&
            res.map((goods, index) => (
              <BagCard key={goods.id} goods={goods} index={index} updateQuantity={updateQuantity} />
            ))}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            width: "32%", // Adjust width to fit the layout
          }}
        >
          <Box
            sx={{
              width: "90%",
              maxHeight: "39vh",
              overflow: "hidden",
              bgcolor: "white",
              border: "1px solid lightgray",
              borderRadius: "10px",
              p: 2,
              mb: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // Center content horizontally
            }}
          >
            <Typography
              sx={{
                justifyContent: "start", // This property won't affect Typography component
                alignItems: "start", // Align text to the start
              }}
              variant="body1"
            >
              Buyutmangiz
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 2 }}>
              <Typography variant="body1">Mahsulotlar(2)</Typography>
              <Typography sx={{ fontSize: "12px" }} variant="body1">
                126 000 so'm
              </Typography>
            </Box>
            <input
              style={{
                width: "90%",
                height: "3vh",
                border: "1px solid #8A2BE2",
                textAlign: "center",
                marginTop: "20px", // Add margin to separate from the above content
                justifyContent: "center",
              }}
              type="text"
              placeholder="Yetkazib berish M06 7 (Ertaga)"
            />
            <Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", mt: 2 }}>
              <Typography variant="body1">Jami:</Typography>
              <Typography variant="body1">120 000 so'm</Typography>
            </Box>
            <Typography variant="body1" sx={{ fontSize: "12px", color: "green", textAlign: "end" }}>
              tejovingiz: 20 000 so'm
            </Typography>
            <Button
              variant="contained"
              sx={{
                borderRadius: "10px",
                width: "90%",
                bgcolor: "#8A2BE2",
                mt: 2, // Add margin to separate from the input field
              }}
            >
              rasmiylashtirishga o'tish
            </Button>
          </Box>

          <Box
            sx={{
              position: "relative",
              width: "90%",

              borderRadius: "10px",
              p: 2,
              mb: 4,
              bgcolor: "#F5F5F5",
              height: "15vh",
            }}
          >
            <Typography sx={{ fontWeight: 700, marginRight: "5px" }} variant="body2">
              Buyurtmalarni topshirish punkitiga bepul yetkazib beramiz
            </Typography>
            <Typography sx={{ fontSize: "14px", marginRight: "5px" }} variant="body2">
              Kuryer orqali bepul yetkazishgacha 880 000 soʻm qoldi
            </Typography>
            <Icon
              variant="outlined"
              sx={{
                position: "absolute",
                top: "10px",
                right: "10px",
                cursor: "pointer",
                color: "gray",
              }}
            >
              <HelpOutlineIcon />
            </Icon>
            <div
              style={{
                position: "absolute",
                bottom: "-10px",
                width: `${percentage}%`,
                borderTop: "1px solid green",
                borderRadius: "5px",
                transition: "width 0.5s ease-in-out",
                height: "4px", // Adjusted height
                fontWeight: "bold", // Add fontWeight
                fontSize: "2px", // Add fontSize
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <Box sx={{ display: "flex" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleDecrease}
                  sx={{ marginRight: "5px" }}
                >
                  -
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  size="small"
                  onClick={handleIncrease}
                  sx={{ marginLeft: "5px" }}
                >
                  +
                </Button>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", color: "green", fontSize: "14px", marginTop: "5px" }}>
                <Typography variant="p">1 000 000 so'm</Typography>
                {/* Add your home icon here */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={0} sx={{ mb: 2, rowGap: "20px", columnGap: "20px" }}>
        {popProds.map((good) => (
          <Grid item key={good.id} xs={12} sm={6} md={4} lg={3} xl={2.2}>
            <ProductCard good={good} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BagPage;
