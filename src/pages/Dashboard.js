import React, { useState } from "react";
import { Grid, Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import Chart from "react-apexcharts";

// قاعدة بيانات وهمية للعرض
const mockData = {
  totalEmployees: 150,
  attendingAtCompany: 120,
  absenceWithoutPermission: 15,
  onExternalMissions: 10,
  onLeave: 5,
  weeklyRest: 20,
};

const Dashboard = () => {
  const [data, setData] = useState(mockData); // استخدام البيانات الوهمية

  const donutChartData = {
    series: [80, 10, 10],
    options: {
      chart: { type: "donut", height: 200 },
      labels: ["حضور", "تأخيرات", "غياب"],
      colors: ["#3A6D8C", "#FFB74D", "#E57373"],
      legend: { position: "bottom" },
    },
  };

  const barChartData = {
    series: [
      { name: "عدد الموظفين", data: [50, 30, 20] },
    ],
    options: {
      chart: { type: "bar", height: 200 },
      colors: ["#3A6D8C"],
      xaxis: {
        categories: ["الفرع الرئيسي", "الفرع1", "الفرع2"],
        title: { text: "الموقع" },
      },
      yaxis: { title: { text: "عدد الموظفين" } },
    },
  };

  const lineChartData = {
    series: [
      { name: "ساعات العمل", data: [8, 7, 6, 9, 8, 7, 6] },
    ],
    options: {
      chart: { type: "line", height: 200 },
      colors: ["#3A6D8C"],
      xaxis: {
        categories: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        title: { text: "اليوم" },
      },
      yaxis: { title: { text: "ساعات العمل" } },
    },
  };

  const areaChartData = {
    series: [
      {
        name: "الرواتب",
        data: [5000, 4800, 4700],
      },
    ],
    options: {
      chart: { type: "area", height: 200 },
      colors: ["#6A9AB0"],
      xaxis: {
        categories: ["الفرع الرئيسي", "الفرع1", "الفرع2"],
        title: { text: "الموقع" },
      },
      yaxis: { title: { text: "الرواتب (ريال)" } },
      fill: { type: "gradient", gradient: { shade: "light", type: "vertical", opacityFrom: 0.7, opacityTo: 0.2 } },
    },
  };

  // دالة تحديث البيانات (في حال أردت تحديث البيانات)
  const updateData = () => {
    setData(mockData); // تحديث البيانات الوهمية
  };

  return (
    <Box
      p={3}
      sx={{
        background: "#FFFFFF",
        minHeight: "100vh",
        borderRadius: "16px",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "#001F3F",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        لوحة التحكم
      </Typography>

      {/* زر تحديث البيانات */}
      <IconButton
        color="primary"
        onClick={updateData} // عند الضغط على الزر سيتم تحديث البيانات
        sx={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 1000,
          backgroundColor: "#3A6D8C",
          color: "#fff",
          borderRadius: "50%",
          padding: "10px",
        }}
      >
        <RefreshIcon />
      </IconButton>

      {/* المؤشرات الرئيسية */}
      <Grid container spacing={3}>
        {/* كروت البيانات الجديدة */}
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#3A6D8C",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6">إجمالي الموظفين المسجلين</Typography>
              <Typography variant="h4">{data.totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#FFB74D",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6">حضور بمقر الشركة</Typography>
              <Typography variant="h4">{data.attendingAtCompany}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#E57373",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6">غياب بدون إذن</Typography>
              <Typography variant="h4">{data.absenceWithoutPermission}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#66BB6A",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6"> مأموريات خارجيه</Typography>
              <Typography variant="h4">{data.onExternalMissions}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#42A5F5",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6">في إجازة</Typography>
              <Typography variant="h4">{data.onLeave}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card
            sx={{
              background: "#FFA726",
              color: "white",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6">الراحة الأسبوعية</Typography>
              <Typography variant="h4">{data.weeklyRest}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* المخططات التفاعلية */}
      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                تحليل الحضور
              </Typography>
              <Chart options={donutChartData.options} series={donutChartData.series} type="donut" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                الحضور حسب الموقع
              </Typography>
              <Chart options={barChartData.options} series={barChartData.series} type="bar" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                ساعات العمل الأسبوعية
              </Typography>
              <Chart options={lineChartData.options} series={lineChartData.series} type="line" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: "16px" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                تحليل الرواتب لكل موقع
              </Typography>
              <Chart options={areaChartData.options} series={areaChartData.series} type="area" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
