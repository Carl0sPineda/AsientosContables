package main

import (
	"context"
	"database/sql"
	_ "github.com/mattn/go-sqlite3"
)

// Category struct
type Category struct {
	ID   int
	Name string
}

// Seating struct
type Seating struct {
	ID          int
	Description string
	Debit       float64
	Credit      float64
	Detail      string
	Date        string
	NumDoc      string
	ASN         string
	CategoryID  int
	Category    string
}

// App struct
type App struct {
	ctx context.Context
	db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
	// Open SQLite database
	db, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		panic(err)
	}

	// Create categories table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS category (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT UNIQUE
	)`)
	if err != nil {
		panic(err)
	}

	// Create seating table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS seating (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		description TEXT,
		debit REAL,
		credit REAL,
		detail TEXT,
		date TEXT,
		num_doc TEXT,
		asn TEXT,
		id_category INTEGER,
		FOREIGN KEY (id_category) REFERENCES category (id)
	)`)
	if err != nil {
		panic(err)
	}

	return &App{db: db}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

// AddCategory adds a new category to the database
func (a *App) AddCategory(name string) error {
	_, err := a.db.Exec("INSERT INTO category (name) VALUES (?)", name)
	return err
}

// AddSeating adds a new seating to the database
func (a *App) AddSeating(description string, debit, credit float64, detail, date, numDoc, asn string, categoryID int) error {
	_, err := a.db.Exec(`
		INSERT INTO seating (description, debit, credit, detail, date, num_doc, asn, id_category)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, description, debit, credit, detail, date, numDoc, asn, categoryID)
	return err
}

// ListSeatings lists all seatings with their categories from the database
func (a *App) ListSeatings() ([]Seating, error) {
	rows, err := a.db.Query(`
		SELECT s.id, s.description, s.debit, s.credit, s.detail, s.date, s.num_doc, s.asn, s.id_category, c.name
		FROM seating s
		INNER JOIN category c ON s.id_category = c.id
		ORDER BY c.name
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var seatings []Seating
	for rows.Next() {
		var seating Seating
		err := rows.Scan(&seating.ID, &seating.Description, &seating.Debit, &seating.Credit, &seating.Detail, &seating.Date, &seating.NumDoc, &seating.ASN, &seating.CategoryID, &seating.Category)
		if err != nil {
			return nil, err
		}
		seatings = append(seatings, seating)
	}
	return seatings, nil
}

// ListCategories lists all categories from the database
func (a *App) ListCategories() ([]Category, error) {
	rows, err := a.db.Query("SELECT * FROM category")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var categories []Category
	for rows.Next() {
		var category Category
		err := rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil
}

// DeleteCategory deletes a category from the database
func (a *App) DeleteCategory(ID int) error {
	_, err := a.db.Exec("DELETE FROM category WHERE id = ?", ID)
	return err
}

// DeleteSeating deletes a seating from the database
func (a *App) DeleteSeating(ID int) error {
	_, err := a.db.Exec("DELETE FROM seating WHERE id = ?", ID)
	return err
}

// EditCategory updates a category in the database
func (a *App) EditCategory(ID int, name string) error {
	_, err := a.db.Exec("UPDATE category SET name=? WHERE id=?", name, ID)
	return err
}

// EditSeating updates a seating in the database
func (a *App) EditSeating(ID int, description string, debit, credit float64, detail, date, numDoc, asn string, categoryID int) error {
	_, err := a.db.Exec(`
		UPDATE seating SET description=?, debit=?, credit=?, detail=?, date=?, num_doc=?, asn=?, id_category=?
		WHERE id=?`, description, debit, credit, detail, date, numDoc, asn, categoryID, ID)
	return err
}
