import { styled, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

const StyledH2 = styled('h2')({
  color: '#fff',
});

const StyledP = styled('p')({
  cursor: 'pointer',
  color: '#fff',
  transition: 'color 0.3s',
  '&:hover': {
    color: '#7FC7D9',
  },
});

export default function Footer() {
  const navigate = useNavigate()

  const goPath = (path:string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`${path}`)
  }

  return (
    <div style={{ background: "#0F1035", height: "auto", top: "auto", bottom: 0, color: "#fff" }}>
      <Grid container spacing={2} justifyContent="center"sx={{ padding:10 }}>
          <Grid item xs={4} style={{ flex: 1, textAlign: "left",minWidth: 250 }}>
              <StyledH2>เกี่ยวกับรีสอร์ทของเรา</StyledH2>
              <div style={{marginTop: 20}}></div>
              <p>เป็นที่พักที่ควรแก่การมา ความสงบและความสุขที่นี่จะทำให้คุณต้องการกลับมาอีกครั้งเพื่อประทับใจด้วยประสบการณ์ที่ท่ามกลางธรรมชาติและวัฒนธรรมท้องถิ่น</p>
              <div style={{marginTop: 20}}></div>

              <div style={{ display: 'flex', }}>
                <StyledP style={{ marginRight: 30 }}>แผนที่เว็บของเรา
                </StyledP>
              </div>
          </Grid>
          <Grid item xs={4} style={{ flex: 1, textAlign: "left" ,minWidth: 250 }}>
              <StyledH2>ศรีวัฒนธรรมรีสอร์ท</StyledH2>
              <div style={{marginTop: 10}}></div>

              <StyledP onClick={() => goPath("/building")}>ห้องพัก</StyledP>
              <div style={{marginTop: 10}}></div>

              <StyledP onClick={() => goPath("/softpower")}>ซอฟต์พาวเวอร์</StyledP>
              <div style={{marginTop: 10}}></div>

              <StyledP onClick={() => goPath("/package")}>แพ็กเกจ</StyledP>
              <div style={{marginTop: 10}}></div>
              <StyledP onClick={() => goPath("/settings")}>ตั้งค่าบัญชี</StyledP>
          </Grid>
          <Grid item xs={4} style={{ flex: 1, textAlign: "left", alignItems: "center" ,minWidth: 250 }}>
              <StyledH2>ช่องทางการติดต่อ</StyledH2>
              <div style={{marginTop: 20}}></div>

              <p> 093-438-2977</p>
              <div style={{marginTop: 10}}></div>

              <p>chawanon26@gmail.com</p>
              <div style={{marginTop: 10}}></div>

              <p>108/33 หมู่ 12 อ.เมือง ต.ปากแพรก จ.กาญจนบุรี 71000</p>
              <div style={{marginTop: 10}}></div>
          </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="start" sx={{ paddingLeft:10,borderTop: '1px solid #7F8C8D'}}>
          <Grid item xs={4} style={{ flex: 1, textAlign: "left",minWidth: 250 }}>

              <h4>ลิขสิทธิ์ 2023 ศรีวัฒนธรรมริมน้ำรีสอร์ท | ออกแบบโดย ชวนนท์ ชื่นเย็น</h4>
              <div style={{marginBottom: 20}}/>
          </Grid>
      </Grid>
    </div>
  )
}
