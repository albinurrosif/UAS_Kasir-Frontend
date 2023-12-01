import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, FormGroup, FormControl, FormLabel, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const Transaksi = () => {
  const [jumlahTransaksi, setJumlahTransaksi] = useState(0);
  const [transaksiList, setTransaksiList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);
  const [validation, setValidation] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editModalShow, setEditModalShow] = useState(false);
  // const [pelangganList, setPelangganList] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response1 = await axios.get('http://localhost:3000/api/transaksi', { headers });
      const data1 = await response1.data.data;
      setJumlahTransaksi(data1.length);
      setTransaksiList(data1);

      // // Fetch pelanggan data
      // const response2 = await axios.get('http://localhost:3000/api/pelanggan', { headers });
      // const data2 = await response2.data.data;
      // setPelangganList(data2);
    } catch (error) {
      console.error('Kesalahan saat mengambil data: ', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  // const [selectedPelanggan, setSelectedPelanggan] = useState('');
  // const getNamaPelanggan = (idpelanggan) => {
  //   const pelanggan = pelangganList.find((pelanggan) => pelanggan.idpelanggan === idpelanggan);
  //   return pelanggan ? pelanggan.namapelanggan : 'Nama Pelanggan Tidak Ditemukan';
  // };
  const [tanggal] = useState('');
  const navigate = useNavigate();

  const handleView = (id) => {
    navigate(`/detailtransaksi/${id}`);
  };

  // const handlePelangganChange = (e) => {
  //   setSelectedPelanggan(e.target.value);
  // };

  // Create
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      tanggal: tanggal,
      // idpelanggan: selectedPelanggan,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/transaksi/store', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Transaksi berhasil ditambahkan.');
        setTimeout(() => setSuccessMessage(''), 5000);
        navigate('/Transaksi');
        fetchData();
        handleCloseModal();
      } else {
        console.error('Respon tidak berhasil:', response);
        setErrorMessage('Terjadi kesalahan saat menambahkan transaksi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Kesalahan:', error);
      if (error.response) {
        console.error('Respon terjadi kesalahan:', error.response.data);
        // Handle specific errors here and provide user feedback
        setValidation({ error: 'Terjadi kesalahan saat menyimpan transaksi.' });
      } else {
        setValidation({ error: 'Terjadi kesalahan. Mohon coba lagi.' });
      }
    }
  };

  // Edit
  // const handleEdit = (id) => {
  //   setSelectedTransaksi(id);
  //   setEditModalShow(true);
  // };

  //

  // delete
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/transaksi/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setSuccessMessage('Transaksi berhasil dihapus.');
          setTimeout(() => setSuccessMessage(''), 5000);
          fetchData();
          console.log('Transaksi berhasil dihapus');
        } else {
          console.error('Respon tidak berhasil:', response);
          setErrorMessage('Terjadi kesalahan saat menghapus transaksi.');
          setTimeout(() => setErrorMessage(''), 5000);
        }
      } catch (error) {
        console.error('Kesalahan:', error);
      }
    }
  };

  // Fungsi formatter tanggal
  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID');
  };

  return (
    <Container>
      <div>
        <h1>Data Transaksi</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="card bg-primary text-white mb-2">
          <div className="card-body">Jumlah Transaksi: {jumlahTransaksi}</div>
        </div>

        <Button variant="info" className="mb-4" onClick={handleSubmit}>
          Tambah Transaksi
        </Button>

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
          </div>
          <div className="card-body">
            <table id="datatablesSimple" className="table table-bordered">
              <thead>
                <tr>
                  <th>Id Transaksi</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {transaksiList.map((transaksi) => (
                  <tr key={transaksi.idtransaksi}>
                    <td>{transaksi.idtransaksi}</td>
                    <td>{formatTanggal(transaksi.tanggal)}</td>
                    <td>
                      <div className="d-flex">
                        <button type="button" className="btn btn-primary me-2" onClick={() => handleView(transaksi.idtransaksi)}>
                          View
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(transaksi.idtransaksi)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal tambah*/}
        {/* <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Transaksi Baru</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormGroup>
                <FormLabel>Pilih Pelanggan</FormLabel>
                <FormControl as="select" name="idpelanggan" value={selectedPelanggan} onChange={handlePelangganChange}>
                  <option value="">Pilih Pelanggan</option>
                  {pelangganList.map((pelanggan) => (
                    <option key={pelanggan.idpelanggan} value={pelanggan.idpelanggan}>
                      {`${pelanggan.namapelanggan} - ${pelanggan.alamat}`}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              {validation.error && <p className="text-danger">{validation.error}</p>}
              <Button variant="success" type="submit" name="tambahtransaksi">
                Submit
              </Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal> */}
      </div>
    </Container>
  );
};

export default Transaksi;
