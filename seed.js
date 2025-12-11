const { Client } = require('@elastic/elasticsearch');

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200'
});

const movies = [
  {
    title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    genre: 'Drama'
  },
  {
    title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
    genre: 'Crime'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
    genre: 'Action'
  },
  {
    title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    genre: 'Crime'
  },
  {
    title: 'Forrest Gump',
    description: 'The presidencies of Kennedy and Johnson unfold through the perspective of an Alabama man with an IQ of 75.',
    genre: 'Drama'
  },
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea.',
    genre: 'Sci-Fi'
  },
  {
    title: 'The Matrix',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    genre: 'Sci-Fi'
  },
  {
    title: 'Goodfellas',
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife and his partners in crime.',
    genre: 'Crime'
  },
  {
    title: 'The Silence of the Lambs',
    description: 'A young FBI cadet must receive the help of an incarcerated cannibal killer to catch another serial killer.',
    genre: 'Thriller'
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    genre: 'Sci-Fi'
  },
  {
    title: 'The Green Mile',
    description: 'The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder who has a mysterious gift.',
    genre: 'Drama'
  },
  {
    title: 'Spirited Away',
    description: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods and witches.',
    genre: 'Animation'
  },
  {
    title: 'Parasite',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    genre: 'Thriller'
  },
  {
    title: 'The Lion King',
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.',
    genre: 'Animation'
  },
  {
    title: 'Gladiator',
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.',
    genre: 'Action'
  },
  {
    title: 'The Departed',
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in Boston.',
    genre: 'Crime'
  },
  {
    title: 'Whiplash',
    description: 'A promising young drummer enrolls at a cut-throat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing.',
    genre: 'Drama'
  },
  {
    title: 'The Prestige',
    description: 'After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion while sacrificing everything they have.',
    genre: 'Mystery'
  },
  {
    title: 'Django Unchained',
    description: 'With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner.',
    genre: 'Western'
  },
  {
    title: 'WALL-E',
    description: 'In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind.',
    genre: 'Animation'
  }
];

async function seedData() {
  try {
    console.log('Connecting to Elasticsearch...');
    
    // Check if Elasticsearch is available
    await client.ping();
    console.log('✓ Connected to Elasticsearch');

    // Check if index exists, delete if it does
    const indexExists = await client.indices.exists({ index: 'movies' });
    if (indexExists) {
      console.log('Deleting existing "movies" index...');
      await client.indices.delete({ index: 'movies' });
      console.log('✓ Existing index deleted');
    }

    // Create index with mapping
    console.log('Creating "movies" index...');
    await client.indices.create({
      index: 'movies',
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            description: { type: 'text' },
            genre: { type: 'keyword' }
          }
        }
      }
    });
    console.log('✓ Index created');

    // Insert movies
    console.log(`Inserting ${movies.length} movies...`);
    for (const movie of movies) {
      await client.index({
        index: 'movies',
        body: movie
      });
    }

    // Refresh index to make documents searchable immediately
    await client.indices.refresh({ index: 'movies' });
    console.log('✓ All movies inserted and index refreshed');

    // Verify insertion
    const count = await client.count({ index: 'movies' });
    console.log(`\n✓ Successfully seeded ${count.count} movies into Elasticsearch`);
    console.log('\nYou can now test the search API:');
    console.log('  curl "http://localhost:3000/search?q=inception"');
    console.log('  curl "http://localhost:3000/search?q=crime"');

  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
}

seedData();
