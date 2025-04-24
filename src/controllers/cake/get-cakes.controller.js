const Cake = require('../../models/cake.model');

exports.getCakes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      flavor,
      sort,
      search
    } = req.query;

    // Build query
    const query = {};

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Flavor filter
    if (flavor) {
      query.flavors = flavor;
    }

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting
    let sortQuery = {};
    if (sort) {
      switch (sort) {
        case 'price':
          sortQuery = { price: 1 };
          break;
        case '-price':
          sortQuery = { price: -1 };
          break;
        case 'newest':
          sortQuery = { createdAt: -1 };
          break;
        default:
          sortQuery = { createdAt: -1 };
      }
    }

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort: sortQuery
    };

    const cakes = await Cake.find(query)
      .sort(sortQuery)
      .skip((options.page - 1) * options.limit)
      .limit(options.limit);

    const total = await Cake.countDocuments(query);

    res.status(200).json({
      success: true,
      count: cakes.length,
      pagination: {
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit)
      },
      data: cakes
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};