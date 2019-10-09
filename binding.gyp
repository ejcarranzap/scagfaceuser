{
  'targets': [
    {
      'target_name': 'main_lib',
      'sources': [
			"./build/src/main.cpp"
      ],
      'include_dirs' : [
          "<!(node -e \"require('nan')\")"
      ],
      'conditions': [
        [ 'OS=="win"', {
          'defines': [
            'uint=unsigned int',
          ],
        }],
      ],
    }
  ]
}