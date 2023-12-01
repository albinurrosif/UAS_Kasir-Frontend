// Import statements
import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const token = localStorage.getItem('token');

const DetailTransaksi = () => {
  const { id } = useParams();

  // const [namapelanggan, setNamaPelanggan] = useState('');
  const [detailTransaksiList, setDetailTransaksiList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduk, setSelectedProduk] = useState('');
  const [jumlahTransaksi, setJumlahTransaksi] = useState(1);
  const [produkList, setProdukList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [editedDetailTransaksi, setEditedDetailTransaksi] = useState('');
  const [idDetailTransaksi, setIdDetailTransaksi] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalPembelian, setTotalPembelian] = useState(0);
  const [showNotaModal, setShowNotaModal] = useState(false);
  const [notaTransaksi, setNotaTransaksi] = useState('');

  useEffect(() => {
    fetchData();
    calculateTotalPembelian();
  }, [detailTransaksiList]);

  const fetchData = async () => {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const response = await axios.get(`http://localhost:3000/api/detailtransaksi/${id}`, { headers });
      const data = response.data.detailTransaksiList;
      setDetailTransaksiList(data);

      // const response1 = await axios.get(`http://localhost:3000/api/transaksi/${id}`, { headers });
      // const data1 = response1.data.data;
      // setNamaPelanggan(data1.namapelanggan);

      const response2 = await axios.get('http://localhost:3000/api/produk', { headers });
      const responseData2 = response2.data.data;
      setProdukList(responseData2);

      calculateTotalPembelian();
      generateNota();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      idtransaksi: id,
      idproduk: selectedProduk,
      jumlah: jumlahTransaksi,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/detailtransaksi/store', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201) {
        setSuccessMessage('Barang berhasil ditambahkan ke transaksi.');
        setTimeout(() => setSuccessMessage(''), 5000);
        handleCloseModal();
        fetchData();
      } else {
        console.error('Response is not successful:', response);
        setErrorMessage('Terjadi kesalahan saat menambahkan barang ke transaksi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Terjadi kesalahan saat menambahkan barang ke transaksi.');
    }
  };

  const calculateTotalPembelian = () => {
    const total = detailTransaksiList.reduce((acc, detailTransaksi) => {
      return acc + detailTransaksi.jumlah * detailTransaksi.harga;
    }, 0);
    setTotalPembelian(total);
  };

  const handleShowEditModal = (detailTransaksi) => {
    setIdDetailTransaksi(detailTransaksi.iddetailtransaksi);
    setEditedDetailTransaksi(detailTransaksi.jumlah);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setIdDetailTransaksi(null);
    setEditedDetailTransaksi('');
    setShowEditModal(false);
  };

  const handleShowDeleteModal = (detailTransaksi) => {
    setIdDetailTransaksi(detailTransaksi.idproduk);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setIdDetailTransaksi(null);
    setShowDeleteModal(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      jumlah: editedDetailTransaksi,
    };

    try {
      const response = await axios.patch(`http://localhost:3000/api/detailtransaksi/update/${idDetailTransaksi}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Data transaksi berhasil diubah.');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
        handleCloseEditModal();
      } else {
        console.error('Respon tidak berhasil:', response);
        setErrorMessage('Terjadi kesalahan saat mengubah data transaksi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Kesalahan:', error);
      if (error.response) {
        console.error('Respon terjadi kesalahan:', error.response.data);
        setErrorMessage('Terjadi kesalahan saat menyimpan perubahan data transaksi.');
      } else {
        setErrorMessage('Terjadi kesalahan. Mohon coba lagi.');
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await axios.delete(`http://localhost:3000/api/detailtransaksi/produk/delete?transaksi=${id}&produk=${idDetailTransaksi}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setSuccessMessage('Transaksi berhasil dihapus.');
        setTimeout(() => setSuccessMessage(''), 5000);
        fetchData();
        handleCloseDeleteModal();
      } else {
        console.error('Respon tidak berhasil:', response);
        setErrorMessage('Terjadi kesalahan saat menghapus transaksi.');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    } catch (error) {
      console.error('Kesalahan:', error);
    }
  };

  const generateNota = () => {
    let nota = `Nota Transaksi\nID Transaksi: ${id}\nTotal Pembelian: ${totalPembelian}\nTanggal Transaksi: ${new Date().toLocaleString()}\n\nDetail Transaksi:\n`;

    detailTransaksiList.forEach((detailTransaksi, index) => {
      nota += `${index + 1}. ${detailTransaksi.namaproduk} - Harga Satuan: ${detailTransaksi.harga.toLocaleString()} - Jumlah: ${detailTransaksi.jumlah} - Sub-total: ${(detailTransaksi.jumlah * detailTransaksi.harga).toLocaleString()}\n`;
    });

    nota += `\nTotal Pembelian: ${totalPembelian}`;

    setNotaTransaksi(nota);
  };

  const printNota = () => {
    // Memastikan totalPembelian dan jumlahTunai berupa angka
    const total = parseFloat(totalPembelian);
    const tunai = parseFloat(jumlahTunai);

    if (isNaN(total) || isNaN(tunai)) {
      // Handle jika terjadi kesalahan atau nilai tidak valid
      console.error('Total pembelian atau jumlah tunai tidak valid.');
      return;
    }

    // Menghitung kembalian
    const kembalianResult = tunai - total;

    // Menampilkan modal nota setelah menghitung kembalian
    setShowNotaModal(true);

    // Menjalankan fungsi generateNota() sebelum mencetak nota
    generateNota();

    // Membuat elemen div untuk menampilkan nota
    const notaDiv = document.createElement('div');

    // Menambahkan detail transaksi ke dalam div
    notaDiv.innerHTML += '<h5>Detail Transaksi:</h5>';
    detailTransaksiList.forEach((detailTransaksi, index) => {
      notaDiv.innerHTML += `
      <table>
      <thead>
                <tr>
                  <th>No</th>
                  <th> Nama Barang </th>
                  <th> Harga satuan </th>
                  <th> Jumlah </th>
                  <th> Sub-total </th>
                </tr>
      </thead>
      <tbody>
      <tr>
        <td>${index + 1}</td>
        <td>${detailTransaksi.namaproduk}</td>
        <td>${detailTransaksi.harga.toLocaleString()}</td>
        <td>${detailTransaksi.jumlah}</td>
        <td>${(detailTransaksi.jumlah * detailTransaksi.harga).toLocaleString()}</td>
      </tr>
      </tbody>
      </table
    `;
    });

    // Menambahkan total pembelian ke dalam div
    notaDiv.innerHTML += `<hr /><h5>Total Pembelian: ${totalPembelian.toLocaleString()}</h5>`;

    // Menambahkan jumlah tunai ke dalam div
    notaDiv.innerHTML += `<h5>Jumlah Tunai: ${jumlahTunai.toLocaleString()}</h5>`;

    // Menambahkan kembalian ke dalam div
    notaDiv.innerHTML += `<h5>Kembalian: ${kembalianResult.toLocaleString()}</h5>`;

    // Membuka jendela pencetakan
    const printWindow = window.open('', '_blank');
    printWindow.document.body.appendChild(notaDiv);

    // Menutup jendela pencetakan setelah mencetak
    printWindow.print();
    printWindow.onafterprint = function () {
      printWindow.close();
    };
  };

  const [jumlahTunai, setJumlahTunai] = useState(0);
  const [kembalian, setKembalian] = useState(0);

  return (
    <Container>
      <div>
        <h1>Data Detail Transaksi: {id}</h1>
        {/* <h3>Nama Pelanggan: {namapelanggan}</h3> */}

        <Button variant="info" className="mb-4" onClick={handleShowModal}>
          Tambah Barang
        </Button>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

        <div className="card mb-4">
          <div className="card-header">
            <i className="fas fa-table me-1"></i>
          </div>
          <div className="card-body">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama Produk</th>
                  <th>Deskripsi</th>
                  <th>Harga Satuan</th>
                  <th>Jumlah</th>
                  <th>Sub-total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {detailTransaksiList?.map((detailTransaksi, index) => (
                  <tr key={detailTransaksi.idproduk}>
                    <td>{index + 1}</td>
                    <td>{detailTransaksi.namaproduk}</td>
                    <td>{detailTransaksi.deskripsi}</td>
                    <td>Rp.{detailTransaksi.harga.toLocaleString()}</td>
                    <td>{detailTransaksi.jumlah}</td>
                    <td>Rp.{(detailTransaksi.jumlah * detailTransaksi.harga).toLocaleString()}</td>
                    <td>
                      {/* <button type="button" className="btn btn-warning mb-4" onClick={() => handleShowEditModal(detailTransaksi)}>
                        Edit
                      </button> */}
                      <button
                        type="button"
                        className="btn btn-danger mb-4"
                        onClick={() => {
                          handleShowDeleteModal(detailTransaksi);
                        }}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <div>
              <h5>Total Pembelian: {totalPembelian}</h5>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Jumlah Tunai:</Form.Label>
              <Form.Control type="number" value={jumlahTunai} onChange={(e) => setJumlahTunai(e.target.value)} />
            </Form.Group>

            {/* Modal tambah */}
            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Tambah Barang</Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleSubmit}>
                <Modal.Body>
                  Pilih Barang
                  <select name="idproduk" className="form-control" value={selectedProduk} onChange={(e) => setSelectedProduk(e.target.value)} required>
                    <option value={''}>Select Produk</option>
                    {produkList?.map((product) => (
                      <option key={product.idproduk} value={product.idproduk}>
                        {product.namaproduk} - {product.deskripsi} (Stock: {product.stok})
                      </option>
                    ))}
                  </select>
                  <input type="number" name="jumlah" className="form-control mt-4" placeholder="Jumlah" min={1} value={jumlahTransaksi} onChange={(e) => setJumlahTransaksi(e.target.value)} required />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" type="submit" name="tambahproduktransaksi">
                    Submit
                  </Button>
                  <Button variant="danger" onClick={handleCloseModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>

            {/* Modal edit
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Barang</Modal.Title>
              </Modal.Header>
              <Form onSubmit={handleEditSubmit}>
                <Modal.Body>
                  Jumlah Transaksi
                  <input type="number" name="jumlah" className="form-control" placeholder="Jumlah Transaksi" min={1} value={editedDetailTransaksi} onChange={(e) => setEditedDetailTransaksi(e.target.value)} required />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" type="submit">
                    Submit
                  </Button>
                  <Button variant="danger" onClick={handleCloseEditModal}>
                    Close
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal> */}

            {/* Modal delete */}
            <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
              <Modal.Header closeButton>
                <Modal.Title>Hapus Barang</Modal.Title>
              </Modal.Header>
              <Modal.Body>Apakah Anda yakin ingin menghapus transaksi ini?</Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleDeleteSubmit}>
                  Hapus
                </Button>
                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                  Batal
                </Button>
              </Modal.Footer>
            </Modal>

            {/* modal nota */}
            <Modal show={showNotaModal} onHide={() => setShowNotaModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Nota Transaksi</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <h5>Detail Transaksi:</h5>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Nama Produk</th>
                      <th>Jumlah</th>
                      <th>Harga Satuan</th>
                      <th>Sub-total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailTransaksiList?.map((detailTransaksi, index) => (
                      <tr key={detailTransaksi.idproduk}>
                        <td>{index + 1}</td>
                        <td>{detailTransaksi.namaproduk}</td>
                        <td>{detailTransaksi.jumlah}</td>
                        <td>{detailTransaksi.harga.toLocaleString()}</td>
                        <td>{(detailTransaksi.jumlah * detailTransaksi.harga).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <hr />
                <h5>Total Pembelian: {totalPembelian}</h5>
                <h5>Jumlah Tunai: {jumlahTunai}</h5>
                {/* Kembalian dapat dihitung berdasarkan total pembelian dan jumlah tunai */}
                <h5>Kembalian: {jumlahTunai - totalPembelian}</h5>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" onClick={printNota}>
                  Cetak Nota
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowNotaModal(false);
                    // Reset jumlah tunai dan kembalian setelah menutup modal
                    setJumlahTunai(0);
                    setKembalian(0);
                  }}
                >
                  Tutup
                </Button>
              </Modal.Footer>
            </Modal>

            <Button variant="success" className="mb-4" onClick={() => setShowNotaModal(true)}>
              Transaksi
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default DetailTransaksi;
