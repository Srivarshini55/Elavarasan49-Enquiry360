import { useMemo, useState } from "react";

const initialEnquiries = [
  {
    id: 1,
    company: "Tech Solutions Pvt Ltd",
    contact: "John David",
    email: "john@techsolutions.com",
    phone: "+91 98765 43210",
    service: "Web Application",
    source: "Website",
    status: "New",
    priority: "High",
    value: 200000,
    followUp: "2026-10-04",
    assigned: "Elavarsan",
    notes: "Interested in a complete business web application.",
  },
  {
    id: 2,
    company: "GreenLeaf Organics",
    contact: "Priya Kumar",
    email: "priya@greenleaf.com",
    phone: "+91 98765 12345",
    service: "UI/UX Design",
    source: "WhatsApp",
    status: "In Progress",
    priority: "Medium",
    value: 80000,
    followUp: "2026-10-03",
    assigned: "Elavarsan",
    notes: "UI redesign discussion in progress.",
  },
  {
    id: 3,
    company: "Bright Minds Academy",
    contact: "Arun Kumar",
    email: "arun@brightminds.com",
    phone: "+91 91234 56789",
    service: "Mobile App",
    source: "Instagram",
    status: "Follow Up",
    priority: "High",
    value: 350000,
    followUp: "2026-10-02",
    assigned: "Elavarsan",
    notes: "Follow-up required today.",
  },
  {
    id: 4,
    company: "Ravi Enterprises",
    contact: "Ravi",
    email: "ravi@ravi-enterprises.com",
    phone: "+91 99887 66554",
    service: "Website Redesign",
    source: "Email",
    status: "In Progress",
    priority: "Low",
    value: 120000,
    followUp: "2026-10-06",
    assigned: "Elavarsan",
    notes: "Waiting for design confirmation.",
  },
  {
    id: 5,
    company: "HealthPlus Solutions",
    contact: "Meena",
    email: "meena@healthplus.com",
    phone: "+91 90000 11122",
    service: "Custom Software",
    source: "Referral",
    status: "Won",
    priority: "High",
    value: 400000,
    followUp: "2026-10-10",
    assigned: "Elavarsan",
    notes: "Project confirmed successfully.",
  },
];

const statuses = ["New", "In Progress", "Follow Up", "Won"];

const emptyForm = {
  company: "",
  contact: "",
  email: "",
  phone: "",
  service: "",
  source: "Website",
  status: "New",
  priority: "Medium",
  value: "",
  followUp: "",
  assigned: "Elavarsan",
  notes: "",
};

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function getDaysDifference(dateString) {
  const today = new Date("2026-10-02");
  const date = new Date(dateString);
  return Math.round((date - today) / (1000 * 60 * 60 * 24));
}

function getFollowLabel(dateString) {
  const days = getDaysDifference(dateString);

  if (days < 0) return "Overdue";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [enquiries, setEnquiries] = useState(initialEnquiries);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [toast, setToast] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((item) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        item.company.toLowerCase().includes(searchText) ||
        item.contact.toLowerCase().includes(searchText) ||
        item.service.toLowerCase().includes(searchText) ||
        item.source.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" || item.source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [enquiries, search, statusFilter, sourceFilter]);

  const totalValue = enquiries.reduce(
    (sum, item) => sum + Number(item.value || 0),
    0
  );

  const wonEnquiries = enquiries.filter((item) => item.status === "Won");

  const activeEnquiries = enquiries.filter(
    (item) => item.status !== "Won"
  );

  const overdue = enquiries.filter(
    (item) => getDaysDifference(item.followUp) < 0
  );

  const todayFollowUps = enquiries.filter(
    (item) => getDaysDifference(item.followUp) === 0
  );

  const conversionRate =
    enquiries.length > 0
      ? Math.round((wonEnquiries.length / enquiries.length) * 100)
      : 0;

  const sources = [...new Set(enquiries.map((item) => item.source))];

  const sourceCounts = sources.map((source) => ({
    source,
    count: enquiries.filter((item) => item.source === source).length,
  }));

  const showToast = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);

    setForm({
      company: item.company,
      contact: item.contact,
      email: item.email,
      phone: item.phone,
      service: item.service,
      source: item.source,
      status: item.status,
      priority: item.priority,
      value: item.value,
      followUp: item.followUp,
      assigned: item.assigned,
      notes: item.notes,
    });

    setShowAddModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.company || !form.contact || !form.service) {
      showToast("Please fill required fields");
      return;
    }

    if (editingId) {
      setEnquiries((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                value: Number(form.value || 0),
              }
            : item
        )
      );

      showToast("Enquiry updated successfully");
    } else {
      const newEnquiry = {
        id: Date.now(),
        ...form,
        value: Number(form.value || 0),
      };

      setEnquiries((prev) => [newEnquiry, ...prev]);

      showToast("New enquiry added successfully");
    }

    setShowAddModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const deleteEnquiry = () => {
    setEnquiries((prev) =>
      prev.filter((item) => item.id !== deleteId)
    );

    setDeleteId(null);
    setShowDetail(false);
    showToast("Enquiry deleted successfully");
  };

  const updateStatus = (id, status) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      )
    );

    setSelectedEnquiry((prev) =>
      prev && prev.id === id
        ? { ...prev, status }
        : prev
    );

    showToast(`Status changed to ${status}`);
  };

  // DRAG START
  const handleDragStart = (event, id) => {
    event.dataTransfer.setData("enquiryId", String(id));
  };

  // DROP
  const handleDrop = (event, newStatus) => {
    event.preventDefault();

    const id = Number(event.dataTransfer.getData("enquiryId"));

    if (!id) return;

    updateStatus(id, newStatus);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const openDetail = (item) => {
    setSelectedEnquiry(item);
    setShowDetail(true);
  };

  const navItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Enquiries", icon: "▤" },
    { name: "Pipeline", icon: "▥" },
    { name: "Follow-ups", icon: "◷" },
    { name: "Reports", icon: "◩" },
  ];

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">E</div>

          <div>
            <h1>Enquiry360</h1>
            <span>Client Management</span>
          </div>
        </div>

        <button className="primary-btn sidebar-add" onClick={openAddModal}>
          ＋ Add Enquiry
        </button>

        <nav className="nav">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => setActivePage(item.name)}
            >
              <span>{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-title">Need Help?</div>
          <small>Check documentation</small>

          <div className="admin-profile">
            <div className="avatar">E</div>

            <div>
              <strong>Elavarsan</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        {/* TOP BAR */}
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search enquiries, clients..."
            />
          </div>

          <div className="top-actions">
            {/* NOTIFICATION */}
            <div className="notification-wrapper">
              <button
                className="icon-btn notification-btn"
                onClick={() =>
                  setShowNotifications(!showNotifications)
                }
              >
                🔔
                {(overdue.length > 0 || todayFollowUps.length > 0) && (
                  <span className="notification-dot">
                    {overdue.length + todayFollowUps.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-panel">
                  <div className="notification-header">
                    <strong>Notifications</strong>
                    <span>{overdue.length + todayFollowUps.length}</span>
                  </div>

                  {overdue.length === 0 &&
                    todayFollowUps.length === 0 && (
                      <div className="empty-notification">
                        🎉 No new notifications
                      </div>
                    )}

                  {overdue.map((item) => (
                    <div
                      className="notification-item overdue-notification"
                      key={item.id}
                      onClick={() => {
                        openDetail(item);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notification-icon">⚠</div>

                      <div>
                        <strong>Overdue Follow-up</strong>
                        <p>{item.company}</p>
                      </div>
                    </div>
                  ))}

                  {todayFollowUps.map((item) => (
                    <div
                      className="notification-item"
                      key={item.id}
                      onClick={() => {
                        openDetail(item);
                        setShowNotifications(false);
                      }}
                    >
                      <div className="notification-icon">📅</div>

                      <div>
                        <strong>Follow-up Today</strong>
                        <p>{item.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DARK MODE */}
            <button
              className="icon-btn"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle dark mode"
            >
              {darkMode ? "☀" : "☾"}
            </button>

            <div className="avatar">E</div>

            <div className="user-info">
              <strong>Elavarsan</strong>
              <span>Admin</span>
            </div>
          </div>
        </header>

        <section className="content">
          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>
              <div className="welcome">
                <div>
                  <span className="eyebrow">OVERVIEW</span>

                  <h2>
                    Good morning, Elavarsan{" "}
                    <span className="wave">👋</span>
                  </h2>

                  <p>
                    Here's what's happening with your enquiries today.
                  </p>
                </div>

                <div className="date-display">
                  ◫ &nbsp; October 02, 2026
                </div>
              </div>

              {/* ANIMATED METRICS */}
              <div className="metrics">
                <div className="metric-card animated-card">
                  <div className="metric-top">
                    <span>Total Enquiries</span>
                    <div className="metric-icon blue">◉</div>
                  </div>

                  <div className="metric-value count-up">
                    {enquiries.length}
                  </div>

                  <div className="metric-change positive">
                    ↑ 12.5% <span>vs last month</span>
                  </div>
                </div>

                <div className="metric-card animated-card">
                  <div className="metric-top">
                    <span>Active Enquiries</span>
                    <div className="metric-icon purple">✦</div>
                  </div>

                  <div className="metric-value">
                    {activeEnquiries.length}
                  </div>

                  <div className="metric-change positive">
                    ↑ 12.5% <span>vs last month</span>
                  </div>
                </div>

                <div className="metric-card animated-card">
                  <div className="metric-top">
                    <span>Total Value</span>
                    <div className="metric-icon green">₹</div>
                  </div>

                  <div className="metric-value">
                    {formatCurrency(totalValue)}
                  </div>

                  <div className="metric-change positive">
                    ↑ 18.2% <span>vs last month</span>
                  </div>
                </div>

                <div className="metric-card animated-card">
                  <div className="metric-top">
                    <span>Won</span>
                    <div className="metric-icon orange">✓</div>
                  </div>

                  <div className="metric-value">
                    {wonEnquiries.length}
                  </div>

                  <div className="metric-change positive">
                    ↑ 12.5% <span>vs last month</span>
                  </div>
                </div>

                <div className="metric-card animated-card">
                  <div className="metric-top">
                    <span>Follow Ups</span>
                    <div className="metric-icon red">◷</div>
                  </div>

                  <div className="metric-value">
                    {todayFollowUps.length}
                  </div>

                  <div className="metric-change">
                    {overdue.length} overdue
                  </div>
                </div>
              </div>

              <div className="dashboard-grid">
                {/* RECENT */}
                <div className="panel recent-panel">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">ACTIVITY</span>
                      <h3>Recent Enquiries</h3>
                    </div>

                    <button
                      className="text-btn"
                      onClick={() => setActivePage("Enquiries")}
                    >
                      View all →
                    </button>
                  </div>

                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>CLIENT</th>
                          <th>SOURCE</th>
                          <th>SERVICE</th>
                          <th>STATUS</th>
                          <th>FOLLOW-UP</th>
                        </tr>
                      </thead>

                      <tbody>
                        {enquiries.slice(0, 5).map((item) => (
                          <tr
                            key={item.id}
                            onClick={() => openDetail(item)}
                            className="clickable-row"
                          >
                            <td>
                              <div className="company">
                                <div className="company-avatar">
                                  {item.company.charAt(0)}
                                </div>

                                <div>
                                  <strong>{item.company}</strong>
                                  <span>{item.contact}</span>
                                </div>
                              </div>
                            </td>

                            <td>{item.source}</td>
                            <td>{item.service}</td>

                            <td>
                              <span
                                className={`status status-${item.status
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                              >
                                {item.status}
                              </span>
                            </td>

                            <td>
                              <span
                                className={
                                  getDaysDifference(item.followUp) <= 0
                                    ? "follow-danger"
                                    : ""
                                }
                              >
                                {item.followUp}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* STATUS CHART */}
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">PIPELINE</span>
                      <h3>Status Overview</h3>
                    </div>
                  </div>

                  <div className="donut-area">
                    <div
                      className="donut"
                      style={{
                        background: `conic-gradient(
                          #4f46e5 0% ${
                            (enquiries.filter(
                              (x) => x.status === "New"
                            ).length /
                              Math.max(enquiries.length, 1)) *
                            100
                          }%,
                          #8b5cf6 ${
                            (enquiries.filter(
                              (x) => x.status === "New"
                            ).length /
                              Math.max(enquiries.length, 1)) *
                              100
                          }% ${
                            ((enquiries.filter(
                              (x) => x.status === "New"
                            ).length +
                              enquiries.filter(
                                (x) => x.status === "In Progress"
                              ).length) /
                              Math.max(enquiries.length, 1)) *
                            100
                          }%,
                          #f59e0b 0 ${
                            ((enquiries.filter(
                              (x) => x.status !== "Won"
                            ).length /
                              Math.max(enquiries.length, 1)) *
                              100)
                          }%,
                          #10b981 0
                        )`,
                      }}
                    >
                      <div className="donut-center">
                        <strong>{enquiries.length}</strong>
                        <span>Total</span>
                      </div>
                    </div>

                    <div className="legend">
                      {statuses.map((status) => {
                        const count = enquiries.filter(
                          (x) => x.status === status
                        ).length;

                        return (
                          <div className="legend-row" key={status}>
                            <div className="legend-left">
                              <span
                                className={`dot dot-${status
                                  .toLowerCase()
                                  .replace(" ", "-")}`}
                              />

                              {status}
                            </div>

                            <strong>{count}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* SOURCE CHART */}
              <div className="panel chart-panel">
                <div className="panel-header">
                  <div>
                    <span className="eyebrow">ANALYTICS</span>
                    <h3>Enquiries by Source</h3>
                  </div>
                </div>

                <div className="bar-chart">
                  {sourceCounts.map((item) => (
                    <div className="bar-row" key={item.source}>
                      <div className="bar-label">
                        <span>{item.source}</span>
                        <strong>{item.count}</strong>
                      </div>

                      <div className="bar">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${
                              (item.count /
                                Math.max(
                                  ...sourceCounts.map((x) => x.count),
                                  1
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* QUICK ACTIONS */}
              <div className="quick-actions">
                <button
                  className="quick-action"
                  onClick={openAddModal}
                >
                  <span>＋</span>
                  <div>
                    <strong>Add Enquiry</strong>
                    <small>Create a new client enquiry</small>
                  </div>
                </button>

                <button
                  className="quick-action"
                  onClick={() => setActivePage("Pipeline")}
                >
                  <span>▥</span>
                  <div>
                    <strong>View Pipeline</strong>
                    <small>Manage your sales pipeline</small>
                  </div>
                </button>

                <button
                  className="quick-action"
                  onClick={() => setActivePage("Follow-ups")}
                >
                  <span>◷</span>
                  <div>
                    <strong>Follow-ups</strong>
                    <small>{todayFollowUps.length} due today</small>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ENQUIRIES */}
          {activePage === "Enquiries" && (
            <>
              <div className="page-title">
                <div>
                  <span className="eyebrow">CLIENT MANAGEMENT</span>
                  <h2>All Enquiries</h2>
                  <p>Manage and track all client requests.</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={openAddModal}
                >
                  ＋ Add Enquiry
                </button>
              </div>

              <div className="panel">
                <div className="filters">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value)
                    }
                  >
                    <option value="All">All Status</option>
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) =>
                      setSourceFilter(e.target.value)
                    }
                  >
                    <option value="All">All Sources</option>
                    {sources.map((source) => (
                      <option key={source}>{source}</option>
                    ))}
                  </select>

                  <span className="filter-result">
                    {filteredEnquiries.length} enquiries
                  </span>
                </div>

                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>CLIENT</th>
                        <th>SERVICE</th>
                        <th>SOURCE</th>
                        <th>VALUE</th>
                        <th>STATUS</th>
                        <th>FOLLOW-UP</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredEnquiries.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="company">
                              <div className="company-avatar">
                                {item.company.charAt(0)}
                              </div>

                              <div>
                                <strong>{item.company}</strong>
                                <span>{item.contact}</span>
                              </div>
                            </div>
                          </td>

                          <td>{item.service}</td>
                          <td>{item.source}</td>
                          <td>{formatCurrency(item.value)}</td>

                          <td>
                            <select
                              className="status-select"
                              value={item.status}
                              onChange={(e) =>
                                updateStatus(
                                  item.id,
                                  e.target.value
                                )
                              }
                            >
                              {statuses.map((status) => (
                                <option key={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>{item.followUp}</td>

                          <td>
                            <div className="action-buttons">
                              <button
                                onClick={() =>
                                  openDetail(item)
                                }
                              >
                                View
                              </button>

                              <button
                                onClick={() =>
                                  openEditModal(item)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="danger-btn"
                                onClick={() =>
                                  setDeleteId(item.id)
                                }
                              >
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
            </>
          )}

          {/* PIPELINE */}
          {activePage === "Pipeline" && (
            <>
              <div className="page-title">
                <div>
                  <span className="eyebrow">SALES PIPELINE</span>
                  <h2>Pipeline</h2>
                  <p>
                    Drag and drop enquiries between stages.
                  </p>
                </div>
              </div>

              <div className="kanban">
                {statuses.map((status) => {
                  const columnItems = enquiries.filter(
                    (item) => item.status === status
                  );

                  const columnValue = columnItems.reduce(
                    (sum, item) => sum + Number(item.value || 0),
                    0
                  );

                  return (
                    <div
                      className="kanban-column"
                      key={status}
                      onDragOver={handleDragOver}
                      onDrop={(event) =>
                        handleDrop(event, status)
                      }
                    >
                      <div className="kanban-title">
                        <div>
                          <span
                            className={`dot dot-${status
                              .toLowerCase()
                              .replace(" ", "-")}`}
                          />

                          <strong>{status}</strong>
                        </div>

                        <span className="count">
                          {columnItems.length}
                        </span>
                      </div>

                      <div className="kanban-value">
                        {formatCurrency(columnValue)}
                      </div>

                      <div className="kanban-list">
                        {columnItems.map((item) => (
                          <div
                            className="kanban-card"
                            key={item.id}
                            draggable
                            onDragStart={(event) =>
                              handleDragStart(
                                event,
                                item.id
                              )
                            }
                            onClick={() =>
                              openDetail(item)
                            }
                          >
                            <div className="drag-handle">
                              ⋮⋮
                            </div>

                            <div className="kanban-card-top">
                              <strong>
                                {item.company}
                              </strong>

                              <span
                                className={`priority ${item.priority.toLowerCase()}`}
                              >
                                {item.priority}
                              </span>
                            </div>

                            <p>{item.service}</p>

                            <div className="kanban-card-bottom">
                              <span>
                                {formatCurrency(item.value)}
                              </span>

                              <span>
                                {getFollowLabel(
                                  item.followUp
                                )}
                              </span>
                            </div>
                          </div>
                        ))}

                        {columnItems.length === 0 && (
                          <div className="drop-placeholder">
                            Drop enquiries here
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* FOLLOW UPS */}
          {activePage === "Follow-ups" && (
            <>
              <div className="page-title">
                <div>
                  <span className="eyebrow">TASK MANAGEMENT</span>
                  <h2>Follow-ups</h2>
                  <p>Track your upcoming client follow-ups.</p>
                </div>
              </div>

              <div className="follow-grid">
                {enquiries
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.followUp) -
                      new Date(b.followUp)
                  )
                  .map((item) => {
                    const days = getDaysDifference(
                      item.followUp
                    );

                    return (
                      <div
                        className={`follow-card ${
                          days <= 0 ? "urgent-card" : ""
                        }`}
                        key={item.id}
                        onClick={() => openDetail(item)}
                      >
                        <div className="follow-date">
                          <strong>
                            {new Date(
                              item.followUp
                            ).getDate()}
                          </strong>

                          <span>OCT</span>
                        </div>

                        <div className="follow-content">
                          <span className="eyebrow">
                            {getFollowLabel(item.followUp)}
                          </span>

                          <h3>{item.company}</h3>
                          <p>{item.contact}</p>
                          <small>{item.service}</small>
                        </div>

                        <span
                          className={`status status-${item.status
                            .toLowerCase()
                            .replace(" ", "-")}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </>
          )}

          {/* REPORTS */}
          {activePage === "Reports" && (
            <>
              <div className="page-title">
                <div>
                  <span className="eyebrow">BUSINESS ANALYTICS</span>
                  <h2>Reports</h2>
                  <p>Overview of your enquiry performance.</p>
                </div>
              </div>

              <div className="report-grid">
                <div className="panel">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">
                        SOURCES
                      </span>
                      <h3>Lead Sources</h3>
                    </div>
                  </div>

                  <div className="bar-chart">
                    {sourceCounts.map((item) => (
                      <div
                        className="bar-row"
                        key={item.source}
                      >
                        <div className="bar-label">
                          <span>{item.source}</span>
                          <strong>{item.count}</strong>
                        </div>

                        <div className="bar">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${
                                (item.count /
                                  Math.max(
                                    ...sourceCounts.map(
                                      (x) => x.count
                                    ),
                                    1
                                  )) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="panel insights">
                  <div className="panel-header">
                    <div>
                      <span className="eyebrow">
                        INSIGHTS
                      </span>
                      <h3>Business Summary</h3>
                    </div>
                  </div>

                  <div className="insight">
                    <span>💰</span>
                    <div>
                      <strong>Total Pipeline Value</strong>
                      <p>{formatCurrency(totalValue)}</p>
                    </div>
                  </div>

                  <div className="insight">
                    <span>🏆</span>
                    <div>
                      <strong>Conversion Rate</strong>
                      <p>{conversionRate}%</p>
                    </div>
                  </div>

                  <div className="insight">
                    <span>⚠️</span>
                    <div>
                      <strong>Overdue Follow-ups</strong>
                      <p>{overdue.length}</p>
                    </div>
                  </div>

                  <div className="insight">
                    <span>📅</span>
                    <div>
                      <strong>Today's Follow-ups</strong>
                      <p>{todayFollowUps.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      </main>

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div
          className="overlay"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  CLIENT MANAGEMENT
                </span>

                <h2>
                  {editingId
                    ? "Edit Enquiry"
                    : "Add New Enquiry"}
                </h2>
              </div>

              <button
                className="close"
                onClick={() =>
                  setShowAddModal(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Company Name *</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleFormChange}
                    placeholder="Company name"
                  />
                </div>

                <div className="form-group">
                  <label>Contact Person *</label>
                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleFormChange}
                    placeholder="Contact person"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleFormChange}
                    placeholder="email@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleFormChange}
                    placeholder="+91"
                  />
                </div>

                <div className="form-group">
                  <label>Service *</label>
                  <input
                    name="service"
                    value={form.service}
                    onChange={handleFormChange}
                    placeholder="Required service"
                  />
                </div>

                <div className="form-group">
                  <label>Source</label>
                  <select
                    name="source"
                    value={form.source}
                    onChange={handleFormChange}
                  >
                    <option>Website</option>
                    <option>WhatsApp</option>
                    <option>Instagram</option>
                    <option>Email</option>
                    <option>Referral</option>
                    <option>LinkedIn</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleFormChange}
                  >
                    {statuses.map((status) => (
                      <option key={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority</label>
                  <select
                    name="priority"
                    value={form.priority}
                    onChange={handleFormChange}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Estimated Value</label>
                  <input
                    type="number"
                    name="value"
                    value={form.value}
                    onChange={handleFormChange}
                    placeholder="200000"
                  />
                </div>

                <div className="form-group">
                  <label>Follow-up Date</label>
                  <input
                    type="date"
                    name="followUp"
                    value={form.followUp}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group">
                  <label>Assigned To</label>
                  <input
                    name="assigned"
                    value={form.assigned}
                    onChange={handleFormChange}
                  />
                </div>

                <div className="form-group full">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleFormChange}
                    rows="4"
                    placeholder="Add notes..."
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setShowAddModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  {editingId
                    ? "Update Enquiry"
                    : "Create Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {showDetail && selectedEnquiry && (
        <div
          className="overlay"
          onClick={() => setShowDetail(false)}
        >
          <div
            className="modal detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  ENQUIRY DETAILS
                </span>

                <h2>{selectedEnquiry.company}</h2>
                <p>{selectedEnquiry.contact}</p>
              </div>

              <button
                className="close"
                onClick={() =>
                  setShowDetail(false)
                }
              >
                ×
              </button>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Email</span>
                <strong>
                  {selectedEnquiry.email || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Phone</span>
                <strong>
                  {selectedEnquiry.phone || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Service</span>
                <strong>
                  {selectedEnquiry.service}
                </strong>
              </div>

              <div className="detail-item">
                <span>Source</span>
                <strong>
                  {selectedEnquiry.source}
                </strong>
              </div>

              <div className="detail-item">
                <span>Priority</span>
                <strong>
                  {selectedEnquiry.priority}
                </strong>
              </div>

              <div className="detail-item">
                <span>Estimated Value</span>
                <strong>
                  {formatCurrency(
                    selectedEnquiry.value
                  )}
                </strong>
              </div>

              <div className="detail-item">
                <span>Follow-up</span>
                <strong>
                  {selectedEnquiry.followUp}
                </strong>
              </div>

              <div className="detail-item">
                <span>Assigned To</span>
                <strong>
                  {selectedEnquiry.assigned}
                </strong>
              </div>

              <div className="detail-item full">
                <span>Notes</span>
                <strong>
                  {selectedEnquiry.notes || "No notes"}
                </strong>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="secondary-btn"
                onClick={() => {
                  openEditModal(selectedEnquiry);
                  setShowDetail(false);
                }}
              >
                Edit
              </button>

              <button
                className="danger-main-btn"
                onClick={() =>
                  setDeleteId(selectedEnquiry.id)
                }
              >
                Delete
              </button>

              {selectedEnquiry.status !== "Won" && (
                <button
                  className="primary-btn"
                  onClick={() =>
                    updateStatus(
                      selectedEnquiry.id,
                      "Won"
                    )
                  }
                >
                  ✓ Mark as Won
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION */}
      {deleteId && (
        <div className="overlay">
          <div className="delete-modal">
            <div className="delete-icon">!</div>

            <h2>Delete Enquiry?</h2>

            <p>
              This action cannot be undone. Are you sure
              you want to delete this enquiry?
            </p>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="danger-main-btn"
                onClick={deleteEnquiry}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="toast">
          <span>✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;