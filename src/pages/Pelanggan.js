// import React, { useState, useEffect } from 'react';
// import { Container, Button, Modal, Form, FormGroup, FormControl, FormLabel, Alert } from 'react-bootstrap';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const token = localStorage.getItem('token');

// const Pelanggan = () => {
//   const [jumlahPelanggan, setJumlahPelanggan] = useState(0);
//   const [pelangganList, setPelangganList] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [namapelanggan, setNamaPelanggan] = useState('');
//   const [notelepon, setNoTelepon] = useState('');
//   const [alamat, setAlamat] = useState('');
//   const [validation, setValidation] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const [editModalShow, setEditModalShow] = useState(false);
//   const [selectedPelanggan, setSelectedPelanggan] = useState(null);
//   const [editedNamaPelanggan, setEditedNamaPelanggan] = useState('');
//   const [editedNoTelepon, setEditedNoTelepon] = useState('');
//   const [editedAlamat, setEditedAlamat] = useState('');
//   const [idpelanggan, setIdPelanggan] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     const headers = {
//       Authorization: `Bearer ${token}`,
//     };
//     try {
//       const response = await axios.get('http://localhost:3000/api/pelanggan', { headers });
//       const data = await response.data.data;
//       setJumlahPelanggan(data.length);
//       setPelangganList(data);
//     } catch (error) {
//       console.error('Kesalahan: ', error);
//     }
//   };

//   const handleShowModal = () => setShowModal(true);
//   const handleCloseModal = () => setShowModal(false);

//   const handleNamaPelangganChange = (e) => {
//     setNamaPelanggan(e.target.value);
//   };
//   const handleNoTeleponChange = (e) => {
//     setNoTelepon(e.target.value);
//   };
//   const handleAlamatChange = (e) => {
//     setAlamat(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       namapelanggan: namapelanggan,
//       notelepon: notelepon,
//       alamat: alamat,
//     };

//     try {
//       const response = await axios.post('http://localhost:3000/api/pelanggan/store', formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 201) {
//         setSuccessMessage('Pelanggan berhasil ditambahkan.');
//         setTimeout(() => setSuccessMessage(''), 5000);
//         handleCloseModal(); // Close modal after successful submission
//         fetchData();
//       } else {
//         console.error('Respon tidak berhasil:', response);
//         setErrorMessage('Terjadi kesalahan saat menambahkan pelanggan.');
//         setTimeout(() => setErrorMessage(''), 5000);
//       }
//     } catch (error) {
//       console.error('Kesalahan:', error);
//       if (error.response) {
//         console.error('Respon terjadi kesalahan:', error.response.data);
//         setValidation({ error: 'Terjadi kesalahan saat menyimpan pelanggan.' });
//       } else {
//         setValidation({ error: 'Terjadi kesalahan. Mohon coba lagi.' });
//       }
//     }
//   };
//   // Edit
//   const handleEdit = (id) => {
//     setIdPelanggan(id);
//     const selectedPelangganData = pelangganList.find((pelanggan) => pelanggan.idpelanggan === id);

//     // Atur nilai awal state yang berkaitan dengan edit
//     setEditedNamaPelanggan(selectedPelangganData.namapelanggan);
//     setEditedNoTelepon(selectedPelangganData.notelepon);
//     setEditedAlamat(selectedPelangganData.alamat);

//     setEditModalShow(true);
//   };

//   // Fungsi untuk menangani submit edit
//   const handleEditSubmit = async (e) => {
//     e.preventDefault();

//     const formData = {
//       namapelanggan: editedNamaPelanggan,
//       notelepon: editedNoTelepon,
//       alamat: editedAlamat,
//     };

//     try {
//       const response = await axios.put(`http://localhost:3000/api/pelanggan/update/${idpelanggan}`, formData, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 200) {
//         setSuccessMessage('Data pelanggan berhasil diubah.');
//         setTimeout(() => setSuccessMessage(''), 5000);
//         fetchData();
//         setEditModalShow(false);
//       } else {
//         console.error('Respon tidak berhasil:', response);
//         setErrorMessage('Terjadi kesalahan saat mengubah data pelanggan.');
//         setTimeout(() => setErrorMessage(''), 5000);
//       }
//     } catch (error) {
//       console.error('Kesalahan:', error);
//       if (error.response) {
//         console.error('Respon terjadi kesalahan:', error.response.data);
//         setValidation({
//           error: 'Terjadi kesalahan saat menyimpan perubahan data pelanggan.',
//         });
//       } else {
//         setValidation({ error: 'Terjadi kesalahan. Mohon coba lagi.' });
//       }
//     }
//   };

//   // delete
//   const handleDelete = async (id) => {
//     if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
//       try {
//         const response = await axios.delete(`http://localhost:3000/api/pelanggan/delete/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (response.status === 200) {
//           setSuccessMessage('Pesanan berhasil dihapus.');
//           setTimeout(() => setSuccessMessage(''), 5000);
//           fetchData();
//           console.log('Pesanan berhasil dihapus');
//         } else {
//           console.error('Respon tidak berhasil:', response);
//           setErrorMessage('Terjadi kesalahan saat menghapus pesanan.');
//           setTimeout(() => setErrorMessage(''), 5000);
//         }
//       } catch (error) {
//         console.error('Kesalahan:', error);
//       }
//     }
//   };

//   return (
//     <Container>
//       <div>
//         <h1>Data Pelanggan</h1>
//         {successMessage && <Alert variant="success">{successMessage}</Alert>}
//         {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
//         <div className="card bg-primary text-white mb-2">
//           <div className="card-body">Jumlah Pelanggan: {jumlahPelanggan}</div>
//         </div>

//         <Button variant="info" className="mb-4" onClick={handleShowModal}>
//           Tambah Pelanggan
//         </Button>

//         <div className="card mb-4">
//           <div className="card-header">
//             <i className="fas fa-table me-1"></i>
//           </div>
//           <div className="card-body">
//             <table id="datatablesSimple" className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>No</th>
//                   <th>Nama Pelanggan</th>
//                   <th>No Telepon</th>
//                   <th>Alamat</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {pelangganList.map((pelanggan, index) => (
//                   <tr key={pelanggan.idpelanggan}>
//                     <td>{index + 1}</td>
//                     <td>{pelanggan.namapelanggan}</td>
//                     <td>{pelanggan.notelepon}</td>
//                     <td>{pelanggan.alamat}</td>
//                     <td>
//                       <div className="d-flex">
//                         <button type="button" className="btn btn-warning me-2" onClick={() => handleEdit(pelanggan.idpelanggan)}>
//                           Edit
//                         </button>
//                         <button type="button" className="btn btn-danger" onClick={() => handleDelete(pelanggan.idpelanggan)}>
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <Modal show={showModal} onHide={handleCloseModal}>
//           <Modal.Header closeButton>
//             <Modal.Title>Tambah Pelanggan Baru</Modal.Title>
//           </Modal.Header>
//           <Form onSubmit={handleSubmit}>
//             <Modal.Body>
//               <FormGroup>
//                 <FormLabel>Nama Pelanggan</FormLabel>
//                 <FormControl type="text" name="namapelanggan" value={namapelanggan} onChange={handleNamaPelangganChange} />
//               </FormGroup>
//               <FormGroup>
//                 <FormLabel>No Telepon</FormLabel>
//                 <FormControl type="text" name="notelepon" value={notelepon} onChange={handleNoTeleponChange} />
//               </FormGroup>
//               <FormGroup>
//                 <FormLabel>Alamat</FormLabel>
//                 <FormControl type="text" name="alamat" value={alamat} onChange={handleAlamatChange} />
//               </FormGroup>
//             </Modal.Body>
//             <Modal.Footer>
//               {validation.error && <p className="text-danger">{validation.error}</p>}
//               <Button variant="success" type="submit" name="tambahpelanggan">
//                 Submit
//               </Button>
//               <Button variant="danger" onClick={handleCloseModal}>
//                 Close
//               </Button>
//             </Modal.Footer>
//           </Form>
//         </Modal>
//         <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
//           <Modal.Header closeButton>
//             <Modal.Title>Edit Data Pelanggan</Modal.Title>
//           </Modal.Header>
//           <Form onSubmit={handleEditSubmit}>
//             <Modal.Body>
//               <FormGroup>
//                 <FormLabel>Nama Pelanggan</FormLabel>
//                 <FormControl type="text" name="editedNamaPelanggan" value={editedNamaPelanggan} onChange={(e) => setEditedNamaPelanggan(e.target.value)} />
//               </FormGroup>
//               <FormGroup>
//                 <FormLabel>No Telepon</FormLabel>
//                 <FormControl type="text" name="editedNoTelepon" value={editedNoTelepon} onChange={(e) => setEditedNoTelepon(e.target.value)} />
//               </FormGroup>
//               <FormGroup>
//                 <FormLabel>Alamat</FormLabel>
//                 <FormControl type="text" name="editedAlamat" value={editedAlamat} onChange={(e) => setEditedAlamat(e.target.value)} />
//               </FormGroup>
//             </Modal.Body>
//             <Modal.Footer>
//               {validation.error && <p className="text-danger">{validation.error}</p>}
//               <Button variant="success" type="submit" name="editpelanggan">
//                 Simpan Perubahan
//               </Button>
//               <Button variant="danger" onClick={() => setEditModalShow(false)}>
//                 Tutup
//               </Button>
//             </Modal.Footer>
//           </Form>
//         </Modal>
//       </div>
//     </Container>
//   );
// };

// export default Pelanggan;
