/* BOOKSPACE — manipulasi DOM, validasi form, katalog, checkout, dan tracking */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const rupiah = value => new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
}).format(Number(value) || 0);

const getBooks = () => {
    try {
        const saved = JSON.parse(localStorage.getItem("bookspace_books_final"));
        return Array.isArray(saved) ? saved : [...dataKatalogBuku];
    } catch {
        return [...dataKatalogBuku];
    }
};

const saveBooks = books => localStorage.setItem("bookspace_books_final", JSON.stringify(books));
const getOrders = () => {
    try {
        const saved = JSON.parse(localStorage.getItem("bookspace_orders_final"));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
};
const saveOrders = orders => localStorage.setItem("bookspace_orders_final", JSON.stringify(orders));

function toast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 2800);
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[char]);
}

function initGlobal() {
    const currentPage = location.pathname.split("/").pop().replace(".html", "");
    $$(`[data-page="${currentPage}"]`).forEach(link => link.classList.add("active"));
    $$("[data-modal]").forEach(button => {
        button.addEventListener("click", () => openModal(document.getElementById(button.dataset.modal)));
    });

    $$("[data-close]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.closest(".modal")));
    });

    $$(".modal").forEach(modal => {
        modal.addEventListener("click", event => {
            if (event.target === modal) closeModal(modal);
        });
    });

    $$("[data-toggle-password]").forEach(button => {
        button.addEventListener("click", () => {
            const input = $("#password");
            if (input) input.type = input.type === "password" ? "text" : "password";
        });
    });

    $$("[data-logout]").forEach(button => {
        button.addEventListener("click", () => {
            localStorage.removeItem("bookspace_logged_in");
            localStorage.removeItem("bookspace_user");
            location.href = "index.html";
        });
    });

    const login = $("#loginForm");
    if (login) {
        login.addEventListener("submit", event => {
            event.preventDefault();
            const email = $("#email").value.trim().toLowerCase();
            const password = $("#password").value;
            const account = dataPengguna.find(user =>
                user.email.toLowerCase() === email && user.password === password
            );
            const isDemoAdmin = email === DEMO_ACCOUNT.email && password === DEMO_ACCOUNT.password;

            if (account || isDemoAdmin) {
                const userName = isDemoAdmin ? "Admin Bookspace" : account.nama;
                localStorage.setItem("bookspace_logged_in", "true");
                localStorage.setItem("bookspace_user", userName);
                location.href = "dashboard.html";
            } else {
                alert("Email atau password yang Anda masukkan salah.");
                $("#password").value = "";
                $("#password").focus();
            }
        });
    }

    const forgot = $("#forgotForm");
    if (forgot) {
        forgot.addEventListener("submit", event => {
            event.preventDefault();
            closeModal($("#forgotModal"));
            forgot.reset();
            toast("Instruksi reset password berhasil disimulasikan.");
        });
    }

    const currentUser = $("#currentUser");
    if (currentUser) currentUser.textContent = localStorage.getItem("bookspace_user") || "Admin Bookspace";
}

function initDashboard() {
    if (!$("#greeting")) return;

    const hour = new Date().getHours();
    $("#greeting").textContent = hour < 11 ? "Selamat pagi, Admin!" :
        hour < 15 ? "Selamat siang, Admin!" :
        hour < 18 ? "Selamat sore, Admin!" : "Selamat malam, Admin!";

    $("#todayDate").textContent = new Intl.DateTimeFormat("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    }).format(new Date());

    const books = getBooks();
    const orders = getOrders();

    $("#totalBooks").textContent = books.length;
    $("#totalStock").textContent = books.reduce((sum, book) => sum + Number(book.stok), 0);
    $("#totalOrders").textContent = orders.length;
    $("#totalRevenue").textContent = rupiah(orders.reduce((sum, order) => sum + Number(order.total), 0));

    $("#featuredBooks").innerHTML = books.slice(0, 3).map(book => `
        <article class="featured-item">
            <div class="mini-cover image-cover" style="background:${escapeHTML(book.warna)}">
                ${book.cover ? `<img src="${escapeHTML(book.cover)}" alt="Cover ${escapeHTML(book.judul)}">` : ""}
                <b>${escapeHTML(book.inisial || book.judul.slice(0, 2).toUpperCase())}</b>
            </div>
            <h3>${escapeHTML(book.judul)}</h3>
            <p>${escapeHTML(book.penulis)}</p>
        </article>
    `).join("");

    const rows = $("#recentOrders");
    if (orders.length) {
        rows.innerHTML = [...orders].reverse().slice(0, 6).map(order => `
            <tr>
                <td><b>${escapeHTML(order.id)}</b></td>
                <td>${escapeHTML(order.nama)}</td>
                <td>${escapeHTML(order.tanggal)}</td>
                <td>${rupiah(order.total)}</td>
                <td><span class="stock-pill stock-ok">Tersimpan</span></td>
            </tr>
        `).join("");
    }
}

function initCatalog() {
    if (!$("#catalogRows")) return;

    let books = getBooks();
    const render = () => {
        const query = $("#catalogSearch").value.trim().toLowerCase();
        const category = $("#categoryFilter").value;
        const filtered = books.filter(book =>
            `${book.judul} ${book.penulis} ${book.kodeBarang || ""}`.toLowerCase().includes(query) &&
            (category === "all" || book.kategori === category)
        );

        $("#catalogRows").innerHTML = filtered.length ? filtered.map(book => `
            <tr>
                <td><div class="book-cell">
                    <span class="book-thumb" style="background:${escapeHTML(book.warna)}">
                        ${book.cover ? `<img src="${escapeHTML(book.cover)}" alt="">` : ""}
                        <b>${escapeHTML(book.inisial || "BK")}</b>
                    </span>
                    <span><b>${escapeHTML(book.judul)}</b><small>${escapeHTML(book.penulis)}</small></span>
                </div></td>
                <td>${escapeHTML(book.kodeBarang || "-")}</td>
                <td>${escapeHTML(book.kategori)}</td>
                <td>${rupiah(book.harga)}</td>
                <td><b>${Number(book.stok)}</b></td>
                <td><span class="stock-pill ${book.stok <= 5 ? "stock-low" : "stock-ok"}">${book.stok <= 5 ? "Stok menipis" : "Tersedia"}</span></td>
                <td><button class="action-btn" data-edit="${book.id}">Edit</button><button class="action-btn delete" data-delete="${book.id}">Hapus</button></td>
            </tr>
        `).join("") : `<tr><td colspan="7" class="empty-cell">Buku tidak ditemukan.</td></tr>`;

        $("#catalogCount").textContent = books.length;
        $("#catalogStock").textContent = books.reduce((sum, book) => sum + Number(book.stok), 0);
        $("#lowStock").textContent = books.filter(book => Number(book.stok) <= 5).length;
    };

    const modal = $("#bookModal");
    const form = $("#bookForm");

    $("#openBookForm").addEventListener("click", () => {
        form.reset();
        $("#bookId").value = "";
        $("#bookModalTitle").textContent = "Tambah buku baru";
        openModal(modal);
    });

    $("#catalogSearch").addEventListener("input", render);
    $("#categoryFilter").addEventListener("change", render);

    $("#catalogRows").addEventListener("click", event => {
        const editButton = event.target.closest("[data-edit]");
        const deleteButton = event.target.closest("[data-delete]");

        if (editButton) {
            const book = books.find(item => item.id === Number(editButton.dataset.edit));
            if (!book) return;
            $("#bookId").value = book.id;
            $("#bookCode").value = book.kodeBarang || "";
            $("#bookEdition").value = book.edisi || "1";
            $("#bookTitle").value = book.judul;
            $("#bookAuthor").value = book.penulis;
            $("#bookCategory").value = book.kategori;
            $("#bookStock").value = book.stok;
            $("#bookPrice").value = book.harga;
            $("#bookModalTitle").textContent = "Ubah informasi buku";
            openModal(modal);
        }

        if (deleteButton) {
            const book = books.find(item => item.id === Number(deleteButton.dataset.delete));
            if (book && confirm(`Hapus buku "${book.judul}" dari katalog?`)) {
                books = books.filter(item => item.id !== book.id);
                saveBooks(books);
                render();
                toast("Buku berhasil dihapus.");
            }
        }
    });

    form.addEventListener("submit", event => {
        event.preventDefault();
        const id = $("#bookId").value;
        const title = $("#bookTitle").value.trim();
        const item = {
            id: id ? Number(id) : Date.now(),
            kodeBarang: $("#bookCode").value.trim(),
            edisi: $("#bookEdition").value.trim(),
            judul: title,
            penulis: $("#bookAuthor").value.trim(),
            kategori: $("#bookCategory").value,
            stok: Number($("#bookStock").value),
            harga: Number($("#bookPrice").value),
            cover: "",
            warna: ["#718c78", "#52738a", "#bd8c57", "#8b7797", "#526b82"][Math.floor(Math.random() * 5)],
            inisial: title.split(/\s+/).slice(0, 2).map(word => word[0]).join("").toUpperCase()
        };

        if (item.stok < 0 || item.harga < 1000) {
            toast("Periksa kembali stok dan harga buku.");
            return;
        }

        if (id) books = books.map(book => book.id === item.id ? { ...book, ...item, cover: book.cover } : book);
        else books.push(item);

        saveBooks(books);
        render();
        closeModal(modal);
        toast(id ? "Data buku diperbarui." : "Buku baru berhasil ditambahkan.");
    });

    render();
}

let cart = [];
const SHIPPING_COST = 15000;

function initCheckout() {
    if (!$("#checkoutForm")) return;

    let books = getBooks();
    const select = $("#bookSelect");

    const fillBookOptions = () => {
        select.innerHTML = `<option value="">Pilih buku dari katalog</option>` +
            books.filter(book => book.stok > 0).map(book =>
                `<option value="${book.id}">${escapeHTML(book.judul)} — ${rupiah(book.harga)} (stok ${book.stok})</option>`
            ).join("");
    };

    const renderCart = () => {
        const subtotal = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
        $("#cartRows").innerHTML = cart.length ? cart.map(item => `
            <tr>
                <td><b>${escapeHTML(item.judul)}</b></td>
                <td>${rupiah(item.harga)}</td>
                <td><div class="qty-control">
                    <button type="button" data-qty="-1" data-id="${item.id}" aria-label="Kurangi">−</button>
                    <b>${item.qty}</b>
                    <button type="button" data-qty="1" data-id="${item.id}" aria-label="Tambah">+</button>
                </div></td>
                <td><b>${rupiah(item.harga * item.qty)}</b></td>
                <td><button type="button" class="action-btn delete" data-remove="${item.id}">×</button></td>
            </tr>
        `).join("") : `<tr><td colspan="5" class="empty-cell">Belum ada buku di pesanan.</td></tr>`;

        $("#subtotalText").textContent = rupiah(subtotal);
        $("#shippingText").textContent = rupiah(cart.length ? SHIPPING_COST : 0);
        $("#totalText").textContent = rupiah(subtotal + (cart.length ? SHIPPING_COST : 0));
    };

    $("#addToCart").addEventListener("click", () => {
        const bookId = Number(select.value);
        const book = books.find(item => item.id === bookId);
        if (!book) return toast("Pilih buku terlebih dahulu.");

        const existing = cart.find(item => item.id === bookId);
        if (existing) {
            if (existing.qty >= book.stok) return toast("Jumlah melebihi stok yang tersedia.");
            existing.qty += 1;
        } else {
            cart.push({ ...book, qty: 1 });
        }
        renderCart();
    });

    $("#cartRows").addEventListener("click", event => {
        const quantityButton = event.target.closest("[data-qty]");
        const removeButton = event.target.closest("[data-remove]");

        if (quantityButton) {
            const item = cart.find(entry => entry.id === Number(quantityButton.dataset.id));
            const book = books.find(entry => entry.id === item?.id);
            if (!item || !book) return;
            item.qty += Number(quantityButton.dataset.qty);
            if (item.qty < 1) cart = cart.filter(entry => entry.id !== item.id);
            if (item.qty > book.stok) {
                item.qty = book.stok;
                toast("Jumlah mencapai batas stok.");
            }
            renderCart();
        }

        if (removeButton) {
            cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove));
            renderCart();
        }
    });

    $("#checkoutForm").addEventListener("submit", event => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) return;
        if (!cart.length) return toast("Tambahkan minimal satu buku ke pesanan.");

        const name = $("#customerName").value.trim();
        const email = $("#customerEmail").value.trim();
        const phone = $("#customerPhone").value.trim();
        const address = $("#customerAddress").value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return toast("Format email belum valid.");
        if (phone.replace(/\D/g, "").length < 8) return toast("Nomor telepon belum valid.");

        const orders = getOrders();
        const now = new Date();
        const sequence = String(orders.length + 14).padStart(3, "0");
        const deliveryNumber = `2026${sequence}`;
        const orderId = `ORD-${now.getFullYear()}-${String(Date.now()).slice(-5)}`;
        const subtotal = cart.reduce((sum, item) => sum + item.harga * item.qty, 0);
        const total = subtotal + SHIPPING_COST;

        const order = {
            id: orderId,
            do: deliveryNumber,
            nama: name,
            email,
            telepon: phone,
            alamat: address,
            tanggal: now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
            total,
            items: cart.map(item => ({ judul: item.judul, qty: item.qty, harga: item.harga })),
            ekspedisi: $("#shippingMethod").value,
            payment: $("#paymentMethod").value,
            status: "Pesanan diproses",
            progress: 25,
            paket: "Reguler",
            kota: address,
            timeline: ["Pesanan dikonfirmasi", "Pesanan sedang disiapkan", "Paket dalam perjalanan", "Paket diterima"]
        };

        orders.push(order);
        saveOrders(orders);

        books = books.map(book => {
            const ordered = cart.find(item => item.id === book.id);
            return ordered ? { ...book, stok: book.stok - ordered.qty } : book;
        });
        saveBooks(books);

        alert(`Pesanan berhasil disimpan!\nNomor pesanan: ${orderId}\nNomor Delivery Order: ${deliveryNumber}\nTotal: ${rupiah(total)}`);
        cart = [];
        event.currentTarget.reset();
        fillBookOptions();
        renderCart();
    });

    fillBookOptions();
    renderCart();
}

function initTracking() {
    if (!$("#trackingForm")) return;

    const result = $("#trackingResult");

    function findTracking(number) {
        const key = number.trim().toUpperCase();
        const original = dataTracking[key];
        if (original) {
            return {
                do: original.nomorDO,
                nama: original.nama,
                status: original.status,
                progress: original.progress,
                ekspedisi: original.ekspedisi,
                tanggal: original.tanggalKirim,
                paket: original.paket,
                total: original.total,
                kota: original.kota,
                timeline: original.perjalanan.map(item => `${item.waktu} — ${item.keterangan}`)
            };
        }

        return getOrders().find(order => order.do.toUpperCase() === key);
    }

    function searchTracking(value) {
        const order = findTracking(value);
        if (!order) {
            result.hidden = true;
            alert("Nomor Delivery Order tidak ditemukan. Periksa kembali nomor DO Anda.");
            return;
        }

        result.hidden = false;
        const steps = order.timeline || ["Pesanan dikonfirmasi", "Paket sedang disiapkan", "Paket dalam perjalanan", "Paket diterima"];
        const progress = Number(order.progress ?? 25);

        result.innerHTML = `
            <article class="content-card">
                <div class="tracking-head">
                    <div><span class="eyebrow">DETAIL PENGIRIMAN</span><h2>${escapeHTML(order.do || order.nomorDO)}</h2><p class="muted small">Penerima: ${escapeHTML(order.nama)}</p></div>
                    <span class="status-pill ${progress >= 100 ? "delivered" : ""}">${escapeHTML(order.status)}</span>
                </div>
                <div class="progress-track"><div class="progress-fill" style="width:${Math.max(0, Math.min(100, progress))}%"></div></div>
                <div class="timeline-list">${steps.map((step, index) => `<div class="timeline-entry"><span class="timeline-dot">${index + 1}</span><span>${escapeHTML(step)}</span></div>`).join("")}</div>
                <div class="tracking-details">
                    <div><small>EKSPEDISI</small><b>${escapeHTML(order.ekspedisi || "-")}</b></div>
                    <div><small>TANGGAL KIRIM</small><b>${escapeHTML(order.tanggal || "-")}</b></div>
                    <div><small>JENIS PAKET</small><b>${escapeHTML(order.paket || "Reguler")}</b></div>
                    <div><small>TOTAL PEMBAYARAN</small><b>${typeof order.total === "number" ? rupiah(order.total) : escapeHTML(order.total || "-")}</b></div>
                </div>
                <p class="muted small tracking-destination">Tujuan: ${escapeHTML(order.kota || order.alamat || "Alamat penerima sesuai data pesanan")}</p>
            </article>
        `;
        result.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    $("#trackingForm").addEventListener("submit", event => {
        event.preventDefault();
        searchTracking($("#deliveryInput").value);
    });

    $$("[data-do]").forEach(button => {
        button.addEventListener("click", () => {
            $("#deliveryInput").value = button.dataset.do;
            searchTracking(button.dataset.do);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initGlobal();
    initDashboard();
    initCatalog();
    initCheckout();
    initTracking();
});
