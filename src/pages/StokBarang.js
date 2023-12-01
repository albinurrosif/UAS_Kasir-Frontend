import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, FormGroup, FormControl, FormLabel, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');

const StokBarang = () => {
  const [jumlahBarang, setJumlahBarang] = useState(0);
  const [barangList, setBarangList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [namaproduk, setNamaProduk] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [validation, setValidation] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editModalShow, setEditModalShow] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [editedNamaProduk, setEditedNamaProduk] = useState('');
  const [editedDeskripsi, setEditedDeskripsi] = useState('');
  const [editedHarga, setEditedHarga] = useState('');
  const [editedStok, setEditedStok] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get('http://localhost:3000/api/produk', { headers });
      const data = response.data.data;
      setJumlahBarang(data.length);
      setBarangList(data);
    } catch (error) {
      console.error('Kesalahan: ', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleNamaProdukChange = (e) => {
    setNamaProduk(e.target.value);
  };
  const handleDeskripsiChange = (e) => {
    setDeskripsi(e.target.value);
  };
  const handleHargaChange = (e) => {
    setHarga(e.target.value);
  };
  const handleStokChange = (e) => {
    setStok(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      namaproduk: namaproduk,
      deskripsi: deskripsi,
      harga: harga,
      stok: stok,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/produk/store', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Barang berhasil ditambahkan.');
        setTimeout(() => setSuccessMessage(''), 5000);
        handleCloseModal(); // Tutup modal setelah pengiriman berhasil
        fetchData(); // Perbarui data setelah pengiriman berhasil
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
    const selectedProdukData = barangList.find((produk) => produk.idproduk === id);
    setSelectedProduk(selectedProdukData);

    // Set nilai awal state yang berkaitan dengan edit
    setEditedNamaProduk(selectedProdukData.namaproduk);
    setEditedDeskripsi(selectedProdukData.deskripsi);
    setEditedHarga(selectedProdukData.harga);
    setEditedStok(selectedProdukData.stok);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      namaproduk: editedNamaProduk,
      deskripsi: editedDeskripsi,
      harga: editedHarga,
      stok: editedStok,
    };

    try {
      const response = await axios.patch(`http://localhost:3000/api/produk/update/${selectedProduk.idproduk}`, formData, {
        headers: {
          'Content-Type': 'application/json',
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
      if (error.response) {
        console.error('Respon terjadi kesalahan:', error.response.data);
        setValidation({
          error: 'Terjadi kesalahan saat menyimpan perubahan data barang.',
        });
      } else {
        setValidation({ error: 'Terjadi kesalahan. Mohon coba lagi.' });
      }
    }
  };

  // delete
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/produk/delete/${id}`, {
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

  return (
    <Container>
      <div>
        <h1>Data Barang</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <div className="card bg-primary text-white mb-2">
          <div className="card-body">Jumlah Barang: {jumlahBarang}</div>
        </div>

        <Button variant="info" className="mb-4" onClick={handleShowModal}>
          Tambah Barang
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
                  <th>Deskripsi</th>
                  <th>Stock</th>
                  <th>Harga</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {barangList.map((barang, index) => (
                  <tr key={barang.idproduk}>
                    <td>{index + 1}</td>
                    <td>{barang.namaproduk}</td>
                    <td>{barang.deskripsi}</td>
                    <td>{barang.stok}</td>
                    <td>Rp.{barang.harga.toLocaleString()}</td>
                    <td>
                      <div className="d-flex">
                        <button type="button" className="btn btn-warning me-2" onClick={() => handleEdit(barang.idproduk)}>
                          Edit
                        </button>
                        <button type="button" className="btn btn-danger" onClick={() => handleDelete(barang.idproduk)}>
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

        {/* Modal Tambah */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Tambah Barang</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl type="text" value={namaproduk} onChange={handleNamaProdukChange} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl type="text" value={deskripsi} onChange={handleDeskripsiChange} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Harga</FormLabel>
                <FormControl type="text" value={harga} onChange={handleHargaChange} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Stok</FormLabel>
                <FormControl type="text" value={stok} onChange={handleStokChange} />
              </FormGroup>
              <Modal.Footer>
                {validation.error && <p className="text-danger">{validation.error}</p>}
                <Button variant="success" type="submit">
                  Submit
                </Button>
                <Button variant="danger" onClick={handleCloseModal}>
                  Close
                </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal Edit */}
        <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Data Barang</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <FormGroup>
                <FormLabel>Nama Produk</FormLabel>
                <FormControl type="text" name="editedNamaProduk" value={editedNamaProduk} onChange={(e) => setEditedNamaProduk(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl type="text" name="editedDeskripsi" value={editedDeskripsi} onChange={(e) => setEditedDeskripsi(e.target.value)} />
              </FormGroup>
              <FormGroup>
                <FormLabel>Harga</FormLabel>
                <FormControl type="text" name="editedHarga" value={editedHarga} onChange={(e) => setEditedHarga(e.target.value)} />
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {validation.error && <p className="text-danger">{validation.error}</p>}
            <Button variant="success" type="submit" name="editbarang" onClick={handleEditSubmit}>
              Simpan Perubahan
            </Button>
            <Button variant="danger" onClick={() => setEditModalShow(false)}>
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </Container>
  );
};

export default StokBarang;
