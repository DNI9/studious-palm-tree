/* eslint-disable no-underscore-dangle */
import type { StackProps } from '@chakra-ui/layout';
import {
  Heading,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToken,
  VStack,
} from '@chakra-ui/react';
import { FormikHelpers } from 'formik';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { IoMdBookmark } from 'react-icons/io';
import { MdEdit } from 'react-icons/md';

import { SITE_URL } from '~/constants';
import { useToaster } from '~/lib/hooks';
import { CollectionSchemaType, CollectionWithCount } from '~/types/collection';

import { CollectionForm } from '../forms';

const MotionVStack = motion<StackProps>(VStack);

type Props = {
  collection: CollectionWithCount;
  isActive?: boolean;
  showEdit?: boolean;
};

export const CollectionCard = ({
  collection,
  isActive = false,
  showEdit,
}: Props) => {
  const [blue200] = useToken('colors', ['blue.400']);
  const { showErrorToast, showSuccessToast } = useToaster();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function updateCollection(
    values: CollectionSchemaType,
    actions: FormikHelpers<CollectionSchemaType>
  ) {
    try {
      const res = await fetch(
        `${SITE_URL}/api/collection?id=${collection.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        }
      );
      if (res.ok) {
        showSuccessToast('collection updated.');
        onClose();
      } else throw new Error(res.statusText || 'Something went wrong');
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to update collection');
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <MotionVStack
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      _hover={{
        boxShadow: 'xl',
        border: '1px',
        borderColor: isActive ? 'blue.300' : 'gray.200',
      }}
      border="1px"
      borderColor={isActive ? 'blue.300' : 'gray.50'}
      bg={isActive ? 'blue.50' : ''}
      boxShadow="md"
      cursor="pointer"
      rounded="md"
      minH={120}
      p={3}
      align="start"
      pos="relative"
    >
      <HStack justify={'space-between'} align="center" w="full">
        <IoMdBookmark size={25} color={blue200} />
        {collection.isPrivate && <FaLock size={12} color="gray" />}
      </HStack>
      <Heading size="md">{collection.title}</Heading>
      {collection.description && <Text>{collection.description}</Text>}
      <Text color="gray" fontSize="sm">
        {collection._count.snippets} snippets
      </Text>
      {showEdit && isActive && (
        <IconButton
          onClick={onOpen}
          pos="absolute"
          _hover={{
            bg: 'blue.200',
          }}
          bottom="2"
          right="2"
          aria-label="Edit collection"
          size="sm"
          variant="ghost"
          icon={<MdEdit />}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update collection</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <CollectionForm
              isUpdateForm
              initialValues={{
                title: collection.title,
                description: collection.description ?? '',
                isPrivate: collection.isPrivate ?? false,
              }}
              onSubmit={updateCollection}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </MotionVStack>
  );
};
