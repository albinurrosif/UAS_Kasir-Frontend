import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, FormGroup, FormControl, FormLabel, Alert } from 'react-bootstrap';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const BarangMasuk = () => {
  const [jumlahProdukMasuk, setJumlahProdukMasuk] = useState('');
  const [produkMasukList, setProdukMasukList] = useState([]);
  const [produkList, setProdukList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editModalShow, setEditModalShow] = useState(false);
  const [editedProdukMasuk, setEditedProdukMasuk] = useState(null);
  const [validation, setValidation] = useState({});
  const [selectedProdukMasuk, setSelectedProdukMasuk] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get('http://localhost:3000/api/produkmasuk', { headers });
      const data = response.data.data;
      setProdukMasukList(data);

      const response2 = await axios.get('http://localhost:3000/api/produk', { headers });
      const data2 = response2.data.data;
      setProdukList(data2);

      // Menghitung total jumlah produk masuk
      const totalJumlahProdukMasuk = data.reduce((total, produkMasuk) => total + produkMasuk.jumlahprodukmasuk, 0);
      setJumlahProdukMasuk(totalJumlahProdukMasuk);
    } catch (error) {
      console.error('Kesalahan: ', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const [tanggal] = useState('');
  const getNamaProduk = (idproduk) => {
    const produk = produkList.find((produk) => produk.idproduk === idproduk);
    return produk ? produk.namaproduk : 'Nama Pelanggan Tidak Ditemukan';
  };

  const handleProdukChange = (e) => {
    setSelectedProdukMasuk(e.target.value);
  };

  const formData = {
    idproduk: selectedProdukMasuk,
    jumlahprodukmasuk: jumlahProdukMasuk,
    tanggalmasuk: tanggal,
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/produkmasuk/store', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Barang berhasil ditambahkan.');
        setTimeout(() => setSuccessMessage(''), 5000);
        handleCloseModal();
        fetchData();
      } else {
        console.error('Respon tidak berhasil:', response);
        setErrorMessage('Terjadi kesalahan saat menambahkan barang.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Kesalahan:', error);
      if (error.response) {
        console.error('Respon terjadi kesalahan:', error.response.data);
        setValidation({ error: 'Terjadi kesalahan saat menyimpan barang.' });
      } else {
        setValidation({ error: 'Terjadi kesalahan. Mohon coba lagi.' });
      }
    }
  };

  const handleEdit = (id) => {
    setEditModalShow(true);
    const selectedProdukMasukData = produkMasukList.find((produkMasuk) => produkMasuk.idprodukmasuk === id);
    setSelectedProdukMasuk(selectedProdukMasukData);
    setEditedProdukMasuk(selectedProdukMasukData.jumlahprodukmasuk);
  };

  const handleEditSubmit = async () => {
    try {
      // Menyaring atau mengubah struktur data jika diperlukan
      const dataToSend = {
        jumlahprodukmasuk: editedProdukMasuk,
        // Properti lain yang dibutuhkan oleh server
      };

      const response = await axios.patch(`http://localhost:3000/api/produkmasuk/update/${selectedProdukMasuk.idprodukmasuk}`, dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Data barang berhasil diubah.');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
        setEditModalShow(false);
      } else {
        console.error('Respon tidak berhasil:', response);
        setErrorMessage('Terjadi kesalahan saat mengubah data barang.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Kesalahan:', error);
      console.error('Detail Kesalahan:', error.response);
    }
  };
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/produkmasuk/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setSuccessMessage('Pesanan berhasil dihapus.');
          setTimeout(() => setSuccessMessage(''), 5000);
          fetchData();
          console.log('Pesanan berhasil dihapus');
        } else {
          console.error('Respon tidak berhasil:', response);
          setErrorMessage('Terjadi kesalahan saat menghapus pesanan.');
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
        <h1>Data Barang Masuk</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Button variant="info" className="mb-4" onClick={handleShowModal}>
          Tambah Barang Masuk
        </Button>

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
          </div>
          <div className="card-body">
            <table id="datatablesSimple" className="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Jumlah</th>
                  <th>Tanggal</th>
                  {/* <th></th> */}
                </tr>
              </thead>
              <tbody>
                {produkMasukList.map((produk, index) => (
                  <tr key={produk.idprodukmasuk}>
                    <td>{index + 1}</td>
                    <td>{getNamaProduk(produk.idproduk)}</td>
                    <td>{produk.jumlahprodukmasuk}</td>
                    <td>{formatTanggal(produk.tanggalmasuk)}</td>
                    {/* <td>
                      <div className="d-flex">
                        <button type="button" className="btn btn-warning me-2" onClick={() => handleEdit(produk.idprodukmasuk)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(produk.idprodukmasuk)}>
                          Delete
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Stok Barang</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <FormGroup>
                <FormLabel>Pilih Barang</FormLabel>
                <FormControl as="select" name="idproduk" value={selectedProdukMasuk ? selectedProdukMasuk.idproduk : ''} onChange={handleProdukChange}>
                  <option value="">Pilih Barang</option>
                  {produkList.map((produk) => (
                    <option key={produk.idproduk} value={produk.idproduk}>
                      {`${produk.namaproduk} - ${produk.deskripsi} (Stok: ${produk.stok})`}
                    </option>
                  ))}
                </FormControl>
              </FormGroup>

              <FormGroup>
                <FormLabel>Jumlah Stok Masuk</FormLabel>
                <FormControl type="number" placeholder="Jumlah" onChange={(e) => setJumlahProdukMasuk(e.target.value)} />
              </FormGroup>
            </Modal.Body>
            <Modal.Footer>
              {validation.error && <p className="text-danger">{validation.error}</p>}
              <Button variant="success" type="submit" name="tambahpesanan">
                Submit
              </Button>
              <Button variant="danger" onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/* Modal Edit */}
        <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Data Barang Masuk</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <FormGroup className="mb-3">
                <FormLabel>Jumlah</FormLabel>
                <FormControl type="number" placeholder="Jumlah" value={editedProdukMasuk !== null ? editedProdukMasuk : ''} onChange={(e) => setEditedProdukMasuk(e.target.value)} />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {validation.error && <p className="text-danger">{validation.error}</p>}
            <Button variant="success" onClick={handleEditSubmit}>
              Submit
            </Button>
            <Button variant="danger" onClick={() => setEditModalShow(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default BarangMasuk;
