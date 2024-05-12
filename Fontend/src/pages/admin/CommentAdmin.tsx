import { Button, DialogTitle, FormControl, FormLabel, IconButton, Input, Modal, ModalDialog, Stack, Select, Option, Textarea } from '@mui/joy'
import { Box, Grid } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useState } from 'react';
import { folderImage } from '../../components/api/agent';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useDropzone } from 'react-dropzone';
import Swal from 'sweetalert2';
import { createAndUpdateComment, createAndUpdateCommentPackage, getComment, getCommentPackage, removeComment } from '../../store/features/commentSlice';
import { Comment, CommentPackage } from '../../components/models/comment';
import StarIcon from '@mui/icons-material/Star';
import { Rating } from "@mui/material";
import { Booking, BookingPackage } from '../../components/models/booking';
import { dropzonesStyles, previewsStyles } from '../../components/Reuse';
import { windowSizes } from '../../components/Reuse';

export default function CommentAdmin() {
  const dispatch = useAppDispatch();
  const { comment, commentPackage } = useAppSelector((state) => state.comment);
  const { bookings, bookingPackages } = useAppSelector((state) => state.booking);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryP, setSearchQueryP] = useState("");
  const windowSize = windowSizes();

  const [filteredComment, setFilteredComment] = useState<Comment[]>([]);
  const [filteredCommentPackage, setFilteredCommentPackage] = useState<CommentPackage[]>([]);

  const [open, setOpen] = useState<boolean>(false);
  const [openP, setOpenP] = useState<boolean>(false);
  const [id, setId] = useState<number>(0);
  const [idP, setIdP] = useState<number>(0);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    { field: 'text', headerName: 'ข้อความ', width: 130 },
    { field: 'star', headerName: 'คะแนน', width: 130 },
    { field: 'bookingId', headerName: 'รหัสจอง', width: 130 },
    {
      field: 'commentImages',
      headerName: 'หลายรูปภาพ',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.value && params.value.map((value: { image: string; }, index: number) => (
            <img
              key={index}
              src={folderImage + value.image}
              alt={`Image ${index}`}
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
            />
          ))}
        </div>
      ),
    },
    {
      field: 'Edit',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setId(params.row.id)
            setOpen(true)
          }}
        >
          <AutoFixHighIcon />
        </IconButton>
      ),
    },
    {
      field: 'Remove',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="danger"
          onClick={async () => {
            const item = await dispatch(removeComment(params.row.id))
            if (item.payload !== "" && item.payload !== undefined) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลเสร็จสิน !",
                showConfirmButton: false,
                timer: 1000
              });
            }
            else {
              Swal.fire({
                position: "center",
                icon: 'error',
                title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                showConfirmButton: false,
                timer: 1000
              });
            }
            fetchData();
          }}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      ),
    },
  ];
  const columnsPackage: GridColDef[] = [
    { field: 'id', headerName: 'รหัส', width: 80 },
    { field: 'text', headerName: 'ข้อความ', width: 130 },
    { field: 'star', headerName: 'คะแนน', width: 130 },
    { field: 'bookingPackageId', headerName: 'รหัสจอง', width: 130 },
    {
      field: 'commentPackageImages',
      headerName: 'หลายรูปภาพ',
      width: 150,
      renderCell: (params) => (
        <div style={{ display: 'flex' }}>
          {params.value && params.value.map((value: { image: string; }, index: number) => (
            <img
              key={index}
              src={folderImage + value.image}
              alt={`Image ${index}`}
              style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '5px' }}
            />
          ))}
        </div>
      ),
    },
    {
      field: 'Edit',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="primary"
          onClick={() => {
            setId(params.row.id)
            setOpen(true)
          }}
        >
          <AutoFixHighIcon />
        </IconButton>
      ),
    },
    {
      field: 'Remove',
      headerName: '',
      width: 55,
      renderCell: (params) => (
        <IconButton
          color="danger"
          onClick={async () => {
            const item = await dispatch(removeComment(params.row.id))
            if (item.payload !== "" && item.payload !== undefined) {
              Swal.fire({
                position: "center",
                icon: "success",
                title: "ลบข้อมูลเสร็จสิน !",
                showConfirmButton: false,
                timer: 1000
              });
            }
            else {
              Swal.fire({
                position: "center",
                icon: 'error',
                title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
                showConfirmButton: false,
                timer: 1000
              });
            }
            fetchData();
          }}
        >
          <RemoveCircleOutlineIcon />
        </IconButton>
      ),
    },
  ];
  const fetchData = async () => {
    await dispatch(getComment());
    await dispatch(getCommentPackage());
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = comment && comment.filter((item) =>
      item && item.text && item.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredComment(filtered);
  }, [searchQuery, comment]);

  useEffect(() => {
    const filtered = commentPackage && commentPackage.filter((item) =>
      item && item.text && item.text.toLowerCase().includes(searchQueryP.toLowerCase())
    );

    setFilteredCommentPackage(filtered);
  }, [searchQueryP, commentPackage]);

  return (
    <Box sx={{ marginTop: 9.5, marginLeft: windowSize < 1183 ? 5 : 30, marginRight: windowSize < 1183 ? 5 : 0 }}>
      <div>
        <h2 style={{ marginTop: 100, marginBottom: -30 }}>แสดงความคิดเห็น</h2>
        <div style={{ marginTop: 50 }} />
        <Box sx={{ marginTop: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={windowSize < 1183 ? 12 : 6}>
              <FormControl>
                <h4>
                  ค้นหาข้อความ
                </h4>
                <Input
                  placeholder="ค้นหา..."
                  startDecorator={
                    <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                    </Button>
                  }
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ borderRadius: 8 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl sx={{ width: 180, marginLeft: windowSize < 1183 ? 0 : 3 }}>
                <h4>
                  สร้างแสดงความคิดเห็น
                </h4>
                <IconButton
                  color="success"
                  onClick={() => {
                    setId(0)
                    setOpen(true)
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </FormControl>
            </Grid>
          </Grid>
          <div style={{ height: 300, maxWidth: 1220, marginTop: 20 }}>
            <DataGrid
              rows={filteredComment}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </Box>
      </div>
      <div>
        <h2 style={{ marginTop: 20, marginBottom: -30 }}>แสดงความคิดเห็นแพ็กเกจ</h2>
        <div style={{ marginTop: 50 }} />
        <Box sx={{ marginTop: 3 }}>
          <Grid container spacing={1}>
            <Grid item xs={windowSize < 1183 ? 12 : 6}>
              <FormControl>
                <h4>
                  ค้นหาข้อความ
                </h4>
                <Input
                  placeholder="ค้นหา..."
                  startDecorator={
                    <Button sx={{ width: 40 }} variant="soft" color="neutral" disabled startDecorator={<SearchIcon />}>
                    </Button>
                  }
                  value={searchQueryP}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ borderRadius: 8 }}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl sx={{ width: 180, marginLeft: windowSize < 1183 ? 0 : 3 }}>
                <h4>
                  สร้างแสดงความคิดเห็น
                </h4>
                <IconButton
                  color="success"
                  onClick={() => {
                    setIdP(0)
                    setOpenP(true)
                  }}
                >
                  <AddCircleOutlineIcon />
                </IconButton>
              </FormControl>
            </Grid>
          </Grid>
          <div style={{ height: 300, maxWidth: 1220, marginTop: 20, marginBottom: 50 }}>
            <DataGrid
              rows={filteredCommentPackage}
              columns={columnsPackage}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 5 },
                },
              }}
              pageSizeOptions={[5, 10]}
              checkboxSelection
            />
          </div>
        </Box>
      </div>
      <ModelComment open={open} setOpen={setOpen} id={id} comments={comment} bookings={bookings} />
      <ModelCommentPackage open={openP} setOpen={setOpenP} id={idP} comments={commentPackage} bookings={bookingPackages} />
    </Box>
  )
}

interface ModelCommentProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  comments: Comment[];
  bookings: Booking[];
}

const ModelComment: React.FC<ModelCommentProps> = ({ open, setOpen, id = 0, comments, bookings }) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");
  const [star, setStar] = useState<number | null>(2.5);
  const [bookingId, setBookingId] = useState<number | null>(0);
  const [images, setImages] = useState<Array<string | File>>([]);

  useEffect(() => {
    if (id !== 0) {
      const comment = comments.find((x) => x.id === id)

      if (comment) {
        setText(comment.text.toString())
        setStar(comment.star)
        setBookingId(comment.bookingId)
        if (comment && comment.commentImages) {
          setImages(comment.commentImages.map((item) => item.image));
        } else setImages([])
      }
    }
    else {
      setText("")
      setStar(2.5)
      setBookingId(0)
      setImages([])
    }
  }, [comments, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getComment());
  };

  const createAndUpdate = async () => {
    Number(bookingId)

    const item = await dispatch(createAndUpdateComment({ id, text, star, bookingId, images }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างข้อมูลเสร็จสิน !",
        showConfirmButton: false,
        timer: 1000
      });
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    fetchData()
  };


  const getRootProps = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImages(acceptedFiles);
      }
    },
    multiple: true,
  });
  const handleCommentChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setBookingId(newValue);
  };

  const filterBooking = bookings && bookings.filter((booking) => booking.status === 2);
  const windowSize = windowSizes();
  const size0 = windowSize < 1183 ? 12 : 6;
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>{id === 0 ? "สร้างแสดงความคิดเห็น" : "แก้ไขแสดงความคิดเห็น"}</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Grid container spacing={1} style={{ overflow: 'auto', maxHeight: 400 }}>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>รหัสจอง</FormLabel>
                <Select
                  sx={{ height: 40 }}
                  value={bookingId}
                  onChange={handleCommentChange}
                  required
                >
                  {filterBooking.length > 0 ?
                    filterBooking.map((booking) => (
                      <Option key={booking.id} value={booking.id}>
                        {booking.id}
                      </Option>
                    ))
                    :
                    <Option value={0}>
                      ยังไม่มีการจอง
                    </Option>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>แสดงความคิดเห็น</FormLabel>
                <Textarea name="text" required value={text} onChange={(e) => setText(e.target.value)} placeholder="ข้อความ..." minRows={2} maxRows={3} />
              </FormControl>
            </Grid>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>คะแนน</FormLabel>
                <div>
                  <Rating
                    name="hover-feedback"
                    value={star}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setStar(newValue);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <FormLabel>{star ? star + " คะแนน" : ""} </FormLabel>
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>หลายรูปภาพ</FormLabel>
                <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
                  <input {...getRootProps.getInputProps()} />
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div key={index}>
                        {image && (
                          <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewsStyles} />
                        )}
                      </div>
                    ))
                  ) : (
                    <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
                  )}
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={filterBooking.length > 0 ? false : true}>ยืนยัน</Button>

            </Grid>
          </Grid>
        </form>
      </ModalDialog>
    </Modal>
  )
}

interface ModelCommentPackageProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id?: number;
  comments: CommentPackage[];
  bookings: BookingPackage[];
}

const ModelCommentPackage: React.FC<ModelCommentPackageProps> = ({ open, setOpen, id = 0, comments, bookings }) => {
  const dispatch = useAppDispatch();
  const [text, setText] = useState<string>("");
  const [star, setStar] = useState<number | null>(2.5);
  const [bookingPackageId, setBookingPackageId] = useState<number | null>(0);
  const [images, setImages] = useState<Array<string | File>>([]);

  useEffect(() => {
    if (id !== 0) {
      const comment = comments.find((x) => x.id === id)

      if (comment) {
        setText(comment.text.toString())
        setStar(comment.star)
        setBookingPackageId(comment.bookingPackageId)
        if (comment && comment.commentPackageImages) {
          setImages(comment.commentPackageImages.map((item) => item.image));
        } else setImages([])
      }
    }
    else {
      setText("")
      setStar(2.5)
      setBookingPackageId(0)
      setImages([])
    }
  }, [comments, id, setOpen]);

  const fetchData = async () => {
    await dispatch(getCommentPackage());
  };

  const createAndUpdate = async () => {
    Number(bookingPackageId)

    const item = await dispatch(createAndUpdateCommentPackage({ id, text, star, bookingPackageId, images }));
    if (item.payload !== "" && item.payload !== undefined) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "สร้างข้อมูลเสร็จสิน !",
        showConfirmButton: false,
        timer: 1000
      });
    }
    else {
      Swal.fire({
        position: "center",
        icon: 'error',
        title: 'เกิดข้อผิดพลาดกรุณาลองใหม่ !',
        showConfirmButton: false,
        timer: 1000
      });
    }
    fetchData()
  };


  const getRootProps = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setImages(acceptedFiles);
      }
    },
    multiple: true,
  });
  const handleCommentChange = (
    event: React.SyntheticEvent | null,
    newValue: number | null,
  ) => {
    setBookingPackageId(newValue);
  };
  const filterBooking = bookings && bookings.filter((booking) => booking.status === 2);
  const windowSize = windowSizes();
  const size0 = windowSize < 1183 ? 12 : 6;

  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <ModalDialog>
        <DialogTitle>{id === 0 ? "สร้างแสดงความคิดเห็นแพ็กเกจ" : "แก้ไขแสดงความคิดเห็นแพ็กเกจ"}</DialogTitle>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            setOpen(false);
            createAndUpdate()
          }}
        >
          <Grid container spacing={1} style={{ overflow: 'auto', maxHeight: 400 }}>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>รหัสจอง</FormLabel>
                <Select
                  sx={{ height: 40 }}
                  value={bookingPackageId}
                  onChange={handleCommentChange}
                  required
                >
                  {filterBooking.length > 0 ?
                    filterBooking.map((booking) => (
                      <Option key={booking.id} value={booking.id}>
                        {booking.id}
                      </Option>
                    ))
                    :
                    <Option value={0}>
                      ยังไม่มีการจองแพ็กเกจ
                    </Option>
                  }
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>แสดงความคิดเห็น</FormLabel>
                <Textarea name="text" required value={text} onChange={(e) => setText(e.target.value)} placeholder="ข้อความ..." minRows={2} maxRows={3} />
              </FormControl>
            </Grid>
            <Grid item xs={size0}>
              <FormControl>
                <FormLabel>คะแนน</FormLabel>
                <div>
                  <Rating
                    name="hover-feedback"
                    value={star}
                    precision={0.5}
                    onChange={(event, newValue) => {
                      setStar(newValue);
                    }}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                  />
                  <FormLabel>{star ? star + " คะแนน" : ""} </FormLabel>
                </div>
              </FormControl>
            </Grid>
            <Grid item xs={size0}><FormControl>
              <FormLabel>หลายรูปภาพ</FormLabel>
              <div {...getRootProps.getRootProps()} style={dropzonesStyles}>
                <input {...getRootProps.getInputProps()} />
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div key={index}>
                      {image && (
                        <img src={typeof image === 'string' ? folderImage + image : URL.createObjectURL(image)} alt="Preview" style={previewsStyles} />
                      )}
                    </div>
                  ))
                ) : (
                  <p>ลากและวางรูปภาพที่นี่ หรือคลิกเพื่อเลือกหลายภาพ</p>
                )}
              </div>
            </FormControl></Grid>
            <Grid item xs={12}>
              <Button type="submit" fullWidth disabled={filterBooking.length > 0 ? false : true}>ยืนยัน</Button>
            </Grid>
          </Grid>
        </form>
      </ModalDialog>
    </Modal>
  )
}
